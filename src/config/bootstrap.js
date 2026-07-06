import { Admin } from '../models/Admin.js';

// Seed the first admin from environment variables the first time the app runs
// against an empty admins collection, so existing .env credentials keep working
// after admins moved into the database.
export async function bootstrapAdmin() {
  const count = await Admin.estimatedDocumentCount();
  if (count > 0) return;

  const username = (process.env.ADMIN_USER || 'admin').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.warn('[bootstrap] no admins exist and ADMIN_PASSWORD_HASH is unset — cannot seed admin');
    return;
  }
  await Admin.create({ username, passwordHash });
  console.log(`[bootstrap] seeded initial admin "${username}" from env`);
}
