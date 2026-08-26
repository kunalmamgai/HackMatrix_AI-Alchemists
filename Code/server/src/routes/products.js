import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = Router();

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  category: z.string().min(1),
  description: z.string().min(10).max(2000),
  price: z.number().int().positive(), // paise
  condition: z.enum(['Excellent', 'Good', 'Fair']),
  image: z.string().url().optional(),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

/**
 * GET /api/products
 * List products with search, category filter, pagination.
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { q, category, condition, sort, page = '1', limit = '12' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { category: { contains: q } },
        { description: { contains: q } },
      ];
    }
    if (category) where.category = category;
    if (condition) where.condition = condition;

    const orderBy = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'newest') orderBy.createdAt = 'desc';
    else orderBy.createdAt = 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limitNum }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('[PRODUCTS:LIST]', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:slug
 * Get single product by slug.
 */
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { reviews: { include: { user: { select: { name: true, picture: true } } }, orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error('[PRODUCTS:GET]', err.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/products
 * Create product (admin only).
 */
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json({ product });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('[PRODUCTS:CREATE]', err.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Update product (admin only).
 */
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ product });
  } catch (err) {
    console.error('[PRODUCTS:UPDATE]', err.message);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product (admin only).
 */
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error('[PRODUCTS:DELETE]', err.message);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
