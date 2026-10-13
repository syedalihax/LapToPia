import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  addOrder,
  updateOrderStatus
} from '../db/store.js';

const router = Router();

// GET all orders
router.get('/', (req, res) => {
  try {
    const orders = getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single order by ID or orderNumber
router.get('/:id', (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create Cash on Delivery order (with automated stock deduction)
router.post('/', (req, res) => {
  try {
    const { customer, items, grossTotalPKR, courier } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.streetAddress) {
      return res.status(400).json({
        success: false,
        error: 'Receiver full name, Pakistani contact number, and street address are required'
      });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least 1 item' });
    }

    const createdOrder = addOrder({
      customer,
      items,
      grossTotalPKR: Number(grossTotalPKR) || 0,
      courier: courier || 'TCS_EXPRESS'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      data: createdOrder
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update order status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['PENDING_COD', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${allowed.join(', ')}`
      });
    }

    const updated = updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
