import bcrypt from 'bcryptjs';
import { signToken, cookieOptions, AUTH_COOKIE } from '../middleware/auth.js';
import { Admin } from '../models/Admin.js';

// Generic message — never reveal whether user or password was wrong.
const GENERIC_FAIL = 'Invalid credentials';
// Dummy hash so bcrypt.compare runs even for an unknown user (constant timing).
const DUMMY_HASH = '$2a$12$abcdefghijklmnopqrstuuWm8n2mB0Zt0J7Yy9m5m1m1m1m1m1m1m';

export async function login(req, res, next) {
  try {
    const { user, password } = req.body || {};
    if (typeof user !== 'string' || typeof password !== 'string' || !user || !password) {
      return res.status(400).json({ error: GENERIC_FAIL });
    }

    const admin = await Admin.findOne({ username: user.trim().toLowerCase() });
    const ok = await bcrypt.compare(password, admin?.passwordHash || DUMMY_HASH);

    if (!admin || !ok) {
      return res.status(401).json({ error: GENERIC_FAIL });
    }

    const token = signToken({ sub: admin.id, username: admin.username, role: 'admin' });
    res.cookie(AUTH_COOKIE, token, cookieOptions());
    res.json({ ok: true, user: admin.username });
  } catch (err) {
    next(err);
  }
}

export function logout(_req, res) {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
}

export function me(req, res) {
  res.json({ id: req.admin?.sub, user: req.admin?.username, role: req.admin?.role });
}

// POST /api/auth/change-password — change the logged-in admin's own password.
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    const admin = await Admin.findById(req.admin?.sub);
    if (!admin) return res.status(401).json({ error: 'Not authenticated' });

    const ok = await bcrypt.compare(String(currentPassword || ''), admin.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Current password is incorrect' });

    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
