import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Middleware: verifies Google ID token or existing JWT session.
 * Attaches `req.user = { id, email, name, picture, role }`.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = header.slice(7);

    // Try decoding as our own JWT first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (user) {
        req.user = { id: user.id, email: user.email, name: user.name, picture: user.picture, role: user.role };
        return next();
      }
    } catch {
      // Not our JWT — try as Google ID token
    }

    // Verify as Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Upsert user
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

    req.user = { id: user.id, email: user.email, name: user.name, picture: user.picture, role: user.role };
    next();
  } catch (err) {
    console.error('[AUTH]', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth — attaches user if token present, but doesn't block.
 */
export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return next();

    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (user) {
      req.user = { id: user.id, email: user.email, name: user.name, picture: user.picture, role: user.role };
    }
  } catch {
    // silently continue without user
  }
  next();
}

/**
 * Middleware: requires specific role(s).
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
