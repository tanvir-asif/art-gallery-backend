import { Router } from 'express';
import {
  listArtworks,
  createArtwork,
  updateArtwork,
  reorderArtworks,
  deleteArtwork,
} from '../controllers/artwork.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', listArtworks);

// Reorder must come before '/:id' so it isn't captured as an id.
router.put('/reorder', requireAuth, reorderArtworks);

router.post('/', requireAuth, upload.single('image'), createArtwork);
router.put('/:id', requireAuth, updateArtwork);
router.delete('/:id', requireAuth, deleteArtwork);

export default router;
