import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createReviewSchema = z.object({
  productId: z.string().optional(),
  centerId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
}).refine((data) => data.productId || data.centerId, {
  message: 'Either productId or centerId is required',
});

/**
 * GET /api/reviews/product/:productId
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: { user: { select: { name: true, picture: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (err) {
    console.error('[REVIEWS:PRODUCT]', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * GET /api/reviews/center/:centerId
 */
router.get('/center/:centerId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { centerId: req.params.centerId },
      include: { user: { select: { name: true, picture: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (err) {
    console.error('[REVIEWS:CENTER]', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * POST /api/reviews
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = createReviewSchema.parse(req.body);

    // Prevent duplicate reviews
    const existing = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        ...(data.productId && { productId: data.productId }),
        ...(data.centerId && { centerId: data.centerId }),
      },
    });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this item' });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        ...data,
      },
      include: { user: { select: { name: true, picture: true } } },
    });

    // Update center rating if applicable
    if (data.centerId) {
      const stats = await prisma.review.aggregate({
        where: { centerId: data.centerId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await prisma.recyclingCenter.update({
        where: { id: data.centerId },
        data: {
          rating: Math.round((stats._avg.rating || 0) * 10) / 10,
          reviewCount: stats._count.rating,
        },
      });
    }

    res.status(201).json({ review });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('[REVIEWS:CREATE]', err.message);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;
