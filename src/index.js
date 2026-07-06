import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { bootstrapAdmin } from './config/bootstrap.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    await bootstrapAdmin();
    const app = createApp();
    app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
  } catch (err) {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  }
}

start();
