import { Router } from 'express';
import { getCustomerDetails, getCustomers } from '../controllers/customerController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));
router.get('/', getCustomers);
router.get('/:id', getCustomerDetails);

export default router;
