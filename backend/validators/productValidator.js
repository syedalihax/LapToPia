import validator from 'validator';

export function validateProductInput(payload) {
  const errors = [];

  if (typeof payload.title !== 'string' || !validator.isLength(payload.title.trim(), { min: 2 })) {
    errors.push('Product title is required and must be at least 2 characters');
  }

  const price = Number(payload.pricePKR);
  if (payload.pricePKR === undefined || payload.pricePKR === '' || !Number.isFinite(price) || price <= 0) {
    errors.push('Price in PKR must be a positive number');
  }

  if (payload.originalPricePKR !== undefined && (!Number.isFinite(Number(payload.originalPricePKR)) || Number(payload.originalPricePKR) < 0)) {
    errors.push('Original price in PKR must be a valid non-negative number');
  }

  const stock = Number(payload.stockQuantity ?? 0);
  if (!Number.isInteger(stock) || stock < 0) {
    errors.push('Stock quantity must be a non-negative integer');
  }

  if (!Array.isArray(payload.images) || payload.images.length < 1 || payload.images.length > 5) {
    errors.push('Images must be between 1 and 5 items');
  } else if (payload.images.some(image => typeof image !== 'string' || !validator.isURL(image.trim(), { protocols: ['http', 'https'], require_protocol: true }))) {
    errors.push('Each product image must be a valid HTTP(S) URL');
  }

  if (typeof payload.sku !== 'string' || !validator.isLength(payload.sku.trim(), { min: 3 })) {
    errors.push('SKU is required');
  }

  return errors;
}
