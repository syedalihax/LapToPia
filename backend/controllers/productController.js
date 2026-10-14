
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { validateProductInput } from '../validators/productValidator.js';

const serializeProduct = product => {
  const doc = product?.toObject ? product.toObject() : product;
  return {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id || null
  };
};

export const getProducts = async (req, res, next) => {
  try {
    const filters = {};

    if (req.query.category) filters.category = req.query.category;
    if (req.query.brand) filters.brand = req.query.brand;
    if (req.query.status) filters.status = req.query.status;

    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      if (searchTerm) {
        filters.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { sku: { $regex: searchTerm, $options: 'i' } }
        ];
      }
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filters.pricePKR = {};
      if (req.query.minPrice) filters.pricePKR.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.pricePKR.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(filters).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products.map(serializeProduct) });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.json({ success: true, data: serializeProduct(product) });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const errors = validateProductInput(req.body);
    if (errors.length > 0) {
      return next(new ApiError(400, errors[0]));
    }

    const cleanImages = Array.isArray(req.body.images)
      ? req.body.images.filter(Boolean).slice(0, 5)
      : [];

    const productData = {
      ...req.body,
      images: cleanImages,
      sku: req.body.sku || `SKU-${Date.now().toString().slice(-6)}`,
      stockQuantity: Number(req.body.stockQuantity || 0),
      pricePKR: Number(req.body.pricePKR),
      originalPricePKR: Number(req.body.originalPricePKR || req.body.pricePKR || 0),
      status: Number(req.body.stockQuantity || 0) > 0 ? 'ACTIVE' : 'OUT_OF_STOCK'
    };

    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Product created successfully', data: serializeProduct(product) });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    if (req.body.images && (!Array.isArray(req.body.images) || req.body.images.length < 1 || req.body.images.length > 5)) {
      return next(new ApiError(400, 'Images must be between 1 and 5'));
    }

    const updateData = { ...req.body };
    if (updateData.stockQuantity !== undefined) {
      updateData.stockQuantity = Number(updateData.stockQuantity);
      updateData.status = updateData.stockQuantity > 0 ? (updateData.status || 'ACTIVE') : 'OUT_OF_STOCK';
    }
    if (updateData.pricePKR !== undefined) updateData.pricePKR = Number(updateData.pricePKR);
    if (updateData.originalPricePKR !== undefined) updateData.originalPricePKR = Number(updateData.originalPricePKR);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Product updated successfully', data: serializeProduct(updatedProduct) });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, 'Product not found'));
    }

    res.json({ success: true, message: 'Product deleted from inventory' });
  } catch (error) {
    next(error);
  }
};
