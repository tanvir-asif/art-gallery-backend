import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

function validUsername(u) {
  return typeof u === 'string' && /^[a-zA-Z0-9._-]{3,40}$/.test(u.trim());
}

// GET /api/admins — list all admin users
export async function listAdmins(_req, res, next) {
  try {
    const admins = await Admin.find().sort({ createdAt: 1 });
    res.json(admins.map((a) => a.toPublic()));
  } catch (err) {
    next(err);
  }
}

// POST /api/admins — create a new admin { username, password }
export async function createAdmin(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!validUsername(username)) {
      return res.status(400).json({ error: 'Username must be 3–40 chars (letters, numbers, . _ -)' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    const uname = username.trim().toLowerCase();
    const exists = await Admin.findOne({ username: uname });
    if (exists) return res.status(409).json({ error: 'That username already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ username: uname, passwordHash });
    res.status(201).json(admin.toPublic());
  } catch (err) {
    next(err);
  }
}

// PUT /api/admins/:id — update another admin { username?, password? }
export async function updateAdmin(req, res, next) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Not found' });

    const { username, password } = req.body || {};
    if (username !== undefined) {
      if (!validUsername(username)) {
        return res.status(400).json({ error: 'Invalid username' });
      }
      const uname = username.trim().toLowerCase();
      const clash = await Admin.findOne({ username: uname, _id: { $ne: admin.id } });
      if (clash) return res.status(409).json({ error: 'That username already exists' });
      admin.username = uname;
    }
    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      admin.passwordHash = await bcrypt.hash(password, 12);
    }
    await admin.save();
    res.json(admin.toPublic());
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admins/:id — remove an admin (never the last one)
export async function deleteAdmin(req, res, next) {
  try {
    const count = await Admin.estimatedDocumentCount();
    if (count <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last remaining admin' });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, id: req.params.id, self: req.admin?.sub === req.params.id });
  } catch (err) {
    next(err);
  }
}
