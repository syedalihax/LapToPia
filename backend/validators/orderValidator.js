export function validateOrderInput(payload) {
  const errors = [];

  if (!payload.customer) {
    errors.push('Customer details are required');
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (Number(payload.grossTotalPKR) < 0) {
    errors.push('Gross total must be greater than or equal to zero');
  }

  return errors;
}
