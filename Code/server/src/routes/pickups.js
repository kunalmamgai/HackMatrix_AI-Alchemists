import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createPickupSchema = z.object({
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  centerId: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  items: z.array(z.object({
    deviceType: z.string().min(1).max(100),
    quantity: z.number().int().positive().max(50),
    condition: z.string().optional(),
  })).min(1).max(20),
});

/**
 * GET /api/pickups
 * List current user's pickup requests.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const pickups = await prisma.pickupRequest.findMany({
      where: { userId: req.user.id },
      include: {
        items: true,
        center: { select: { name: true, address: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ pickups });
  } catch (err) {
    console.error('[PICKUPS:LIST]', err.message);
    res.status(500).json({ error: 'Failed to fetch pickups' });
  }
});

/**
 * POST /api/pickups
 * Create a pickup request.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = createPickupSchema.parse(req.body);
    const pickup = await prisma.pickupRequest.create({
      data: {
        userId: req.user.id,
        address: data.address,
        city: data.city,
        centerId: data.centerId,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        notes: data.notes,
        items: { create: data.items },
      },
      include: { items: true },
    });
    res.status(201).json({ pickup });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('[PICKUPS:CREATE]', err.message);
    res.status(500).json({ error: 'Failed to create pickup request' });
  }
});

/**
 * PATCH /api/pickups/:id/cancel
 */
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const pickup = await prisma.pickupRequest.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!pickup) return res.status(404).json({ error: 'Pickup not found' });
    if (!['pending', 'scheduled'].includes(pickup.status)) {
      return res.status(400).json({ error: 'Cannot cancel this pickup' });
    }
    const updated = await prisma.pickupRequest.update({
      where: { id: pickup.id },
      data: { status: 'cancelled' },
    });
    res.json({ pickup: updated });
  } catch (err) {
    console.error('[PICKUPS:CANCEL]', err.message);
    res.status(500).json({ error: 'Failed to cancel pickup' });
  }
});

export default router;
