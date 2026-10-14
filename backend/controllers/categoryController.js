import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

const toSlug = value => String(value ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const cleanSubcategories = (value, categorySlug) => {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  return items.map(item => {
    const name = (typeof item === 'string' ? item : item?.name || '').trim();
    if (!name) return null;
    const requestedSlug = typeof item === 'object' && item?.slug ? item.slug : `${categorySlug}-${name}`;
    const slug = toSlug(requestedSlug);
    return slug ? { name, slug } : null;
  }).filter(Boolean);
};

const hasSubcategorySlugConflict = async (subcategories, categorySlug, excludeId) => {
  const categories = await Category.find(excludeId ? { _id: { $ne: excludeId } } : {}).select('slug subcategories');
  const usedSlugs = new Set(categories.flatMap(category => [
    category.slug,
    ...category.subcategories.map(item => typeof item === 'string' ? toSlug(item) : item.slug),
  ]));
  const requestedSlugs = subcategories.map(item => item.slug);
  return usedSlugs.has(categorySlug)
    || new Set(requestedSlugs).size !== requestedSlugs.length
    || requestedSlugs.some(slug => usedSlugs.has(slug));
};

const serializeCategory = (category) => {
  const doc = category?.toObject ? category.toObject() : category;
  return {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id || null,
  };
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
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
    const brands = await Brand.find().sort({ name: 1 });
    const productBrandNames = await Product.distinct('brand');
    const managedNames = new Set(brands.map(brand => brand.name.toLowerCase()));
    const legacyBrands = productBrandNames
      .filter(name => name && !managedNames.has(name.toLowerCase()))
      .map(name => ({ id: `legacy-${toSlug(name)}`, name, tier: 'UNMANAGED', managed: false }));
    const payload = [
      ...brands.map(brand => ({
        ...brand.toObject(),
        id: brand._id.toString(),
        managed: true,
      })),
      ...legacyBrands,
    ];

    res.json({
      success: true,
      count: payload.length,
      data: payload,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (!name) return next(new ApiError(400, 'Category name is required'));

    const slug = toSlug(req.body.slug || name);
    if (!slug) return next(new ApiError(400, 'Category slug must contain letters or numbers'));
    const subcategories = cleanSubcategories(req.body.subcategories, slug);
    if (await hasSubcategorySlugConflict(subcategories, slug)) {
      return next(new ApiError(409, 'Category subcategory slugs must be unique'));
    }
    const category = await Category.create({
      name,
      slug,
      value: typeof req.body.value === 'string' && req.body.value.trim() ? req.body.value.trim() : name,
      icon: req.body.icon?.trim() || 'category',
      subcategories,
    });
    res.status(201).json({ success: true, data: serializeCategory(category) });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) return next(new ApiError(404, 'Category not found'));

    const updates = {};
    if (req.body.name !== undefined) {
      if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
        return next(new ApiError(400, 'Category name is required'));
      }
      updates.name = req.body.name.trim();
    }
    if (req.body.slug !== undefined) {
      updates.slug = toSlug(String(req.body.slug));
      if (!updates.slug) return next(new ApiError(400, 'Category slug must contain letters or numbers'));
    }
    if (req.body.value !== undefined) {
      if (typeof req.body.value !== 'string' || !req.body.value.trim()) {
        return next(new ApiError(400, 'Product category value is required'));
      }
      updates.value = req.body.value.trim();
    }
    if (req.body.icon !== undefined) updates.icon = String(req.body.icon).trim() || 'category';
    if (req.body.subcategories !== undefined) {
      updates.subcategories = cleanSubcategories(req.body.subcategories, updates.slug || existingCategory.slug);
    }
    if (await hasSubcategorySlugConflict(updates.subcategories || existingCategory.subcategories, updates.slug || existingCategory.slug, existingCategory._id)) {
      return next(new ApiError(409, 'Category and subcategory slugs must be unique'));
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (category.value !== existingCategory.value) {
      await Product.updateMany({ category: existingCategory.value }, { $set: { category: category.value } });
    }
    res.json({ success: true, data: serializeCategory(category) });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ApiError(404, 'Category not found'));

    const productCount = await Product.countDocuments({ category: category.value || category.name });
    if (productCount) {
      return next(new ApiError(409, `Move or delete the ${productCount} product(s) in this category before deleting it`));
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (!name) return next(new ApiError(400, 'Brand name is required'));

    const slug = toSlug(req.body.slug || name);
    if (!slug) return next(new ApiError(400, 'Brand slug must contain letters or numbers'));
    const brand = await Brand.create({
      name,
      slug,
      tier: typeof req.body.tier === 'string' && req.body.tier.trim() ? req.body.tier.trim() : 'VERIFIED OEM',
      website: typeof req.body.website === 'string' ? req.body.website.trim() : '',
    });
    res.status(201).json({ success: true, data: { ...brand.toObject(), id: brand._id.toString(), managed: true } });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const existingBrand = await Brand.findById(req.params.id);
    if (!existingBrand) return next(new ApiError(404, 'Brand not found'));

    const updates = {};
    if (req.body.name !== undefined) {
      if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
        return next(new ApiError(400, 'Brand name is required'));
      }
      updates.name = req.body.name.trim();
    }
    if (req.body.slug !== undefined) {
      updates.slug = toSlug(String(req.body.slug));
      if (!updates.slug) return next(new ApiError(400, 'Brand slug must contain letters or numbers'));
    }
    if (req.body.tier !== undefined) updates.tier = String(req.body.tier).trim() || 'VERIFIED OEM';
    if (req.body.website !== undefined) updates.website = String(req.body.website).trim();

    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (brand.name !== existingBrand.name) {
      await Product.updateMany({ brand: existingBrand.name }, { $set: { brand: brand.name } });
    }
    res.json({ success: true, data: { ...brand.toObject(), id: brand._id.toString(), managed: true } });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new ApiError(404, 'Brand not found'));

    const productCount = await Product.countDocuments({ brand: brand.name });
    if (productCount) {
      return next(new ApiError(409, `Move or delete the ${productCount} product(s) for this brand before deleting it`));
    }

    await brand.deleteOne();
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};