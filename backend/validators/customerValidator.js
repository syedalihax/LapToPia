import validator from 'validator';

export function validateCustomerInput(payload) {
  const errors = [];

  if (!payload.fullName || !validator.isLength(payload.fullName.trim(), { min: 2 })) {
    errors.push('Receiver full name is required');
  }

  if (!payload.phone || !validator.isMobilePhone(payload.phone, 'en-PK')) {
    errors.push('A valid Pakistani phone number is required');
  }

  if (!payload.streetAddress || !validator.isLength(payload.streetAddress.trim(), { min: 5 })) {
    errors.push('Street address is required');
  }

  return errors;
}
