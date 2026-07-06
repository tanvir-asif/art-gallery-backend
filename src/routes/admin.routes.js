import { Router } from 'express';
import {
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admins.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// All admin-management routes require a valid session.
router.use(requireAuth);
router.get('/', listAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;
