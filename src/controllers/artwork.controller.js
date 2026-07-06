import { Artwork } from '../models/Artwork.js';
import { uploadBuffer, deleteByPublicId } from '../config/cloudinary.js';
import { verifyImageBuffer } from '../utils/validateImage.js';

function clampString(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

// GET /api/artworks — public
export async function listArtworks(_req, res, next) {
  try {
    const items = await Artwork.find().sort({ order: 1, createdAt: 1 });
    res.json(items.map((a) => a.toPublic()));
  } catch (err) {
    next(err);
  }
}

// POST /api/artworks — protected, multipart
export async function createArtwork(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    const check = await verifyImageBuffer(req.file.buffer);
    if (!check.ok) return res.status(400).json({ error: check.reason });

    const title = clampString(req.body.title, 160);
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const description = clampString(req.body.description, 2000);

    const uploaded = await uploadBuffer(req.file.buffer, 'gallery');

    // Place new artwork at the end.
    const last = await Artwork.findOne().sort({ order: -1 }).select('order');
    const order = last ? last.order + 1 : 0;

    const art = await Artwork.create({
      title,
      description,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      width: uploaded.width,
      height: uploaded.height,
      order,
    });

    res.status(201).json(art.toPublic());
  } catch (err) {
    next(err);
  }
}

// PUT /api/artworks/:id — protected. Edit title/description/order.
export async function updateArtwork(req, res, next) {
  try {
    const update = {};
    if (req.body.title !== undefined) {
      const title = clampString(req.body.title, 160);
      if (!title) return res.status(400).json({ error: 'Title cannot be empty' });
      update.title = title;
    }
    if (req.body.description !== undefined) {
      update.description = clampString(req.body.description, 2000);
    }
    if (req.body.order !== undefined) {
      const order = Number(req.body.order);
      if (!Number.isFinite(order)) return res.status(400).json({ error: 'Invalid order' });
      update.order = order;
    }

    const art = await Artwork.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!art) return res.status(404).json({ error: 'Not found' });
    res.json(art.toPublic());
  } catch (err) {
    next(err);
  }
}

// PUT /api/artworks/reorder — protected. Bulk reorder. body: { ids: [id, id, ...] }
export async function reorderArtworks(req, res, next) {
  try {
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids array required' });
    }
    const ops = ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    }));
    await Artwork.bulkWrite(ops);
    const items = await Artwork.find().sort({ order: 1, createdAt: 1 });
    res.json(items.map((a) => a.toPublic()));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/artworks/:id — protected. Removes from Cloudinary + Mongo.
export async function deleteArtwork(req, res, next) {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ error: 'Not found' });

    if (art.publicId) {
      try {
        await deleteByPublicId(art.publicId);
      } catch (e) {
        console.warn('[cloudinary] delete failed, removing DB record anyway:', e?.message);
      }
    }
    await art.deleteOne();
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
}
