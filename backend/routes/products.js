import { Router } from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../db/store.js';

const router = Router();

// GET all products with filtering
router.get('/', (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      brand: req.query.brand,
      search: req.query.search,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      status: req.query.status
    };
    const products = getProducts(filters);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new product (Validation: min 1 image, max 5 images)
router.post('/', (req, res) => {
  try {
    const { title, pricePKR, stockQuantity, images, category, brand, specs } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Product title is required' });
    }
    if (pricePKR === undefined || isNaN(Number(pricePKR)) || Number(pricePKR) < 0) {
      return res.status(400).json({ success: false, error: 'Valid price in PKR is required' });
    }
    if (!Array.isArray(images) || images.length < 1) {
      return res.status(400).json({ success: false, error: 'At least 1 product image is required' });
    }
    if (images.length > 5) {
      return res.status(400).json({ success: false, error: 'Maximum 5 images allowed per product' });
    }

    const newProduct = addProduct(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  try {
    if (req.body.images && (!Array.isArray(req.body.images) || req.body.images.length < 1 || req.body.images.length > 5)) {
      return res.status(400).json({ success: false, error: 'Images must be between 1 and 5' });
    }
    const updated = updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE product
router.delete('/:id', (req, res) => {
  try {
    const success = deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted from inventory' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
