import Category from '../models/Category.js';
import Product from '../models/Product.js';

const serializeCategory = (category) => {
  const doc = category?.toObject ? category.toObject() : category;
  return {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id || null,
  };
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories.map(serializeCategory),
    });
  } catch (error) {
    next(error);
  }
};

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand');
    const payload = brands.map((brand, index) => ({
      id: `brand-${index + 1}`,
      name: brand,
      activeSkus: 0,
      tier: 'VERIFIED OEM',
    }));

    res.json({
      success: true,
      count: payload.length,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
};