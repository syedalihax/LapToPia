import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, authorize('admin'), updateSettings);

export default router;
