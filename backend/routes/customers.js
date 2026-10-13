import { Router } from 'express';
import { getCustomers } from '../db/store.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const customers = getCustomers();
    res.json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
