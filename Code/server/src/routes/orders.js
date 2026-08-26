import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive().max(10),
  })).min(1).max(50),
  shippingAddress: z.string().min(5).max(500).optional(),
  paymentMethod: z.enum(['card', 'upi', 'wallet']).default('card'),
});

/**
 * GET /api/orders
 * List current user's orders.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { select: { name: true, image: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    console.error('[ORDERS:LIST]', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

/**
 * GET /api/orders/:id
 * Get single order.
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    console.error('[ORDERS:GET]', err.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

/**
 * POST /api/orders
 * Create order (does NOT charge — use /api/payments to complete payment).
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Validate products exist and have stock
    const productIds = data.items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map(p => [p.id, p]));

    let totalAmount = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    const taxAmount = Math.round(totalAmount * 0.05);
    const shippingFee = 5000; // ₹50 in paise

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          taxAmount,
          shippingFee,
          paymentMethod: data.paymentMethod,
          shippingAddress: data.shippingAddress,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      // Decrement stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json({ order });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    console.error('[ORDERS:CREATE]', err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * PATCH /api/orders/:id/cancel
 * Cancel an order (only if pending).
 */
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Restore stock
      const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      });
    });

    res.json({ order: updated });
  } catch (err) {
    console.error('[ORDERS:CANCEL]', err.message);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
