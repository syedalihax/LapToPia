
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import { validateProductInput } from '../validators/productValidator.js';

const toSlug = value => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function resolveCategory(categoryValue, subcategoryValue) {
  const value = typeof categoryValue === 'string' ? categoryValue.trim() : '';
  const category = await Category.findOne({ $or: [{ value }, { name: value }, { slug: value }] });
  if (!category) throw new ApiError(400, 'Select a valid product category');

  if (!subcategoryValue) return { category: category.value || category.name, subcategory: '', subcategorySlug: '' };
  const requestedSubcategory = String(subcategoryValue).trim();
  const subcategory = category.subcategories.find(item => (
    (typeof item === 'string' ? item : item.name) === requestedSubcategory
    || (typeof item === 'object' && item.slug === requestedSubcategory)
  ));
  if (!subcategory) throw new ApiError(400, 'Select a subcategory belonging to this category');
  if (typeof subcategory === 'string') {
    return { category: category.value || category.name, subcategory, subcategorySlug: toSlug(`${category.slug}-${subcategory}`) };
  }
  return { category: category.value || category.name, subcategory: subcategory.name, subcategorySlug: subcategory.slug };
}

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

    if (req.query.category) {
      const category = await Category.findOne({ $or: [{ value: req.query.category }, { name: req.query.category }, { slug: req.query.category }] });
      filters.category = category?.value || category?.name || req.query.category;
    }
    if (req.query.brand) filters.brand = req.query.brand;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.subcategory) filters.subcategorySlug = req.query.subcategory;
    if (req.query.inStock === 'true') filters.stockQuantity = { $gt: 0 };

    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      if (searchTerm) {
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filters.$or = [
          { title: { $regex: escapedSearchTerm, $options: 'i' } },
          { brand: { $regex: escapedSearchTerm, $options: 'i' } },
          { category: { $regex: escapedSearchTerm, $options: 'i' } },
          { sku: { $regex: escapedSearchTerm, $options: 'i' } },
          { description: { $regex: escapedSearchTerm, $options: 'i' } },
          { 'specs.value': { $regex: escapedSearchTerm, $options: 'i' } }
        ];
      }
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      filters.pricePKR = {};
      if (req.query.minPrice !== undefined) {
        const minPrice = Number(req.query.minPrice);
        if (!Number.isFinite(minPrice) || minPrice < 0) throw new ApiError(400, 'Minimum price must be a valid non-negative number');
        filters.pricePKR.$gte = minPrice;
      }
      if (req.query.maxPrice !== undefined) {
        const maxPrice = Number(req.query.maxPrice);
        if (!Number.isFinite(maxPrice) || maxPrice < 0) throw new ApiError(400, 'Maximum price must be a valid non-negative number');
        filters.pricePKR.$lte = maxPrice;
      }
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

    const taxonomy = await resolveCategory(req.body.category || 'Laptops', req.body.subcategorySlug || req.body.subcategory);

    const cleanImages = Array.isArray(req.body.images)
      ? req.body.images.filter(Boolean).slice(0, 5)
      : [];

    const productData = {
      ...req.body,
      ...taxonomy,
      slug: toSlug(req.body.slug || `${req.body.title}-${req.body.sku || `sku-${Date.now()}`}`),
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

    const candidate = { ...product.toObject(), ...req.body };
    const errors = validateProductInput(candidate);
    if (errors.length > 0) return next(new ApiError(400, errors[0]));

    if (req.body.images && (!Array.isArray(req.body.images) || req.body.images.length < 1 || req.body.images.length > 5)) {
      return next(new ApiError(400, 'Images must be between 1 and 5'));
    }

    const updateData = { ...req.body };
    if (updateData.category !== undefined || updateData.subcategory !== undefined || updateData.subcategorySlug !== undefined) {
      const taxonomy = await resolveCategory(
        updateData.category || product.category,
        updateData.subcategorySlug || updateData.subcategory || (updateData.category ? '' : product.subcategorySlug || product.subcategory)
      );
      Object.assign(updateData, taxonomy);
    }
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
