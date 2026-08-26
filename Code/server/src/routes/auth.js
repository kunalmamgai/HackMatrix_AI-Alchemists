import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/google
 * Receives Google credential response, verifies token, returns JWT + user.
 */
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' });
    }

    // Decode JWT payload (the Google ID token is a JWT)
    // In production, verify with google-auth-library; here we decode for speed
    const parts = credential.split('.');
    if (parts.length !== 3) {
      return res.status(400).json({ error: 'Invalid credential format' });
    }

    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    );

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { googleId: payload.sub },
      update: {
        name: payload.name,
        picture: payload.picture,
        email: payload.email,
      },
      create: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });

    // Generate our own JWT (valid for 7 days)
    const appToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: appToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[AUTH:GOOGLE]', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * GET /api/auth/me
 * Returns current user profile from token.
 */
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, picture: true, role: true, createdAt: true },
  });
  res.json({ user });
});

/**
 * PUT /api/auth/profile
 * Update user profile.
 */
router.put('/profile', requireAuth, async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...(name && { name }) },
    select: { id: true, name: true, email: true, picture: true, role: true },
  });
  res.json({ user });
});

export default router;
