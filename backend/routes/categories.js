import { Router } from 'express';
import { getCategories, getBrands } from '../db/store.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const categories = getCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/brands', (req, res) => {
  try {
    const brands = getBrands();
    res.json({ success: true, count: brands.length, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
