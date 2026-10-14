import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', protect, authorize('admin'), getOrders);
router.get('/mine', protect, getMyOrders);
router.get('/:id', protect, authorize('admin'), getOrderById);
router.post('/', protect, createOrder);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
