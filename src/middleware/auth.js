import jwt from 'jsonwebtoken';

export const AUTH_COOKIE = 'gallery_token';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
}

export function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000, // 2h
    path: '/',
  };
}

/** Verify the JWT from the httpOnly cookie. Protects write routes. */
export function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
