import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const createCenterSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().min(4).max(10),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  acceptedTypes: z.string().default('Electronics'),
  operatingHours: z.string().default('Mon-Sat: 9AM-6PM'),
});

/**
 * GET /api/centers
 * List recycling centers with optional city/distance filter.
 */
router.get('/', async (req, res) => {
  try {
    const { city, q, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (city) where.city = { contains: city };
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { address: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const [centers, total] = await Promise.all([
      prisma.recyclingCenter.findMany({ where, orderBy: { rating: 'desc' }, skip, take: limitNum }),
      prisma.recyclingCenter.count({ where }),
    ]);

    res.json({
      centers,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('[CENTERS:LIST]', err.message);
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
});

/**
 * GET /api/centers/:slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const center = await prisma.recyclingCenter.findUnique({
      where: { slug: req.params.slug },
      include: { reviews: { include: { user: { select: { name: true, picture: true } } }, orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!center) return res.status(404).json({ error: 'Center not found' });
    res.json({ center });
  } catch (err) {
    console.error('[CENTERS:GET]', err.message);
    res.status(500).json({ error: 'Failed to fetch center' });
  }
});

/**
 * POST /api/centers
 * Create a recycling center (admin only).
 */
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const data = createCenterSchema.parse(req.body);
    const center = await prisma.recyclingCenter.create({ data });
    res.status(201).json({ center });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('[CENTERS:CREATE]', err.message);
    res.status(500).json({ error: 'Failed to create center' });
  }
});

/**
 * PUT /api/centers/:id
 */
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const center = await prisma.recyclingCenter.update({ where: { id: req.params.id }, data: req.body });
    res.json({ center });
  } catch (err) {
    console.error('[CENTERS:UPDATE]', err.message);
    res.status(500).json({ error: 'Failed to update center' });
  }
});

export default router;
