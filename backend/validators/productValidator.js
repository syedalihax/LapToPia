import validator from 'validator';

export function validateProductInput(payload) {
  const errors = [];

  if (!payload.title || !validator.isLength(payload.title.trim(), { min: 2 })) {
    errors.push('Product title is required and must be at least 2 characters');
  }

  if (payload.pricePKR === undefined || Number(payload.pricePKR) < 0) {
    errors.push('Valid price in PKR is required');
  }

  if (!Array.isArray(payload.images) || payload.images.length < 1 || payload.images.length > 5) {
    errors.push('Images must be between 1 and 5 items');
  }

  if (!payload.sku || !validator.isLength(payload.sku.trim(), { min: 3 })) {
    errors.push('SKU is required');
  }

  return errors;
}
