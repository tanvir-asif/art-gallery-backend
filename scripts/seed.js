// Seeds 4 placeholder artworks so the gallery is populated on first run.
// Uses public-domain images already hosted on Cloudinary's demo cloud, so no
// upload is required. Run: npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { Artwork } from '../src/models/Artwork.js';

const seeds = [
  {
    title: 'Still Life with Apples',
    description: 'A warm study of fruit and light. Placeholder seed artwork.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/w_1024,q_auto,f_auto/sample.jpg',
    publicId: 'seed/sample',
    width: 864,
    height: 576,
    order: 0,
  },
  {
    title: 'Coastal Morning',
    description: 'Soft light over a quiet shore. Placeholder seed artwork.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/w_1024,q_auto,f_auto/beach.jpg',
    publicId: 'seed/beach',
    width: 1024,
    height: 683,
    order: 1,
  },
  {
    title: 'The Balloon',
    description: 'A single balloon against open sky. Placeholder seed artwork.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/w_1024,q_auto,f_auto/balloons.jpg',
    publicId: 'seed/balloons',
    width: 1024,
    height: 683,
    order: 2,
  },
  {
    title: 'Portrait Study',
    description: 'A classic portrait composition. Placeholder seed artwork.',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/w_1024,q_auto,f_auto/woman.jpg',
    publicId: 'seed/woman',
    width: 819,
    height: 1024,
    order: 3,
  },
];

async function run() {
  await connectDB(process.env.MONGODB_URI);
  await Artwork.deleteMany({ publicId: /^seed\// });
  await Artwork.insertMany(seeds);
  console.log(`[seed] inserted ${seeds.length} placeholder artworks`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error('[seed] failed:', e);
  process.exit(1);
});
