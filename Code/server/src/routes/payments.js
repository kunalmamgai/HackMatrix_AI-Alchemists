import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/checkout
 * Creates a Stripe Checkout session for an order.
 */
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not pending' });
    }

    // Build Stripe line items from order items
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.name,
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: item.priceAtPurchase,
      },
      quantity: item.quantity,
    }));

    // Add tax and shipping as separate line items
    if (order.taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Tax (5%)' },
          unit_amount: order.taxAmount,
        },
        quantity: 1,
      });
    }
    if (order.shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Shipping' },
          unit_amount: order.shippingFee,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout?success=true&orderId=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?cancelled=true`,
      metadata: { orderId: order.id, userId: req.user.id },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('[PAYMENTS:CHECKOUT]', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook — handles checkout.session.completed events.
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { orderId } = session.metadata;

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          stripePaymentId: session.payment_intent,
        },
      });
      console.log(`[PAYMENTS] Order ${orderId} marked as paid`);
    } catch (err) {
      console.error('[WEBHOOK] Failed to update order:', err.message);
    }
  }

  res.json({ received: true });
});

/**
 * POST /api/payments/create-intent
 * Creates a Stripe Payment Intent for direct card payments.
 */
router.post('/create-intent', requireAuth, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const intent = await stripe.paymentIntents.create({
      amount: order.totalAmount + order.taxAmount + order.shippingFee,
      currency: 'inr',
      metadata: { orderId: order.id, userId: req.user.id },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('[PAYMENTS:INTENT]', err.message);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

export default router;
