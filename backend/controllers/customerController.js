import Customer from '../models/Customer.js';

const serializeCustomer = customer => {
  const doc = customer?.toObject ? customer.toObject() : customer;
  return {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id || null
  };
};

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, data: customers.map(serializeCustomer) });
  } catch (error) {
    next(error);
  }
};
