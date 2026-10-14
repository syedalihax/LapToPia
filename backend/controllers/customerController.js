import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

const statusCounts = ['PENDING_COD', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
const customerIdentity = customer => customer.userId?.toString()
  || (customer.email?.trim() ? `email:${customer.email.trim().toLowerCase()}` : '')
  || (customer.phone?.replace(/\D/g, '') ? `phone:${customer.phone.replace(/\D/g, '')}` : '')
  || `customer:${customer._id?.toString() || customer.id}`;
const orderIdentity = order => order.userId?.toString()
  || (order.customer.email?.trim() ? `email:${order.customer.email.trim().toLowerCase()}` : '')
  || (order.customer.phone?.replace(/\D/g, '') ? `phone:${order.customer.phone.replace(/\D/g, '')}` : '')
  || `order:${order._id.toString()}`;

const serializeCustomer = customer => {
  const doc = customer?.toObject ? customer.toObject() : customer;
  return {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id || null
  };
};

export const getCustomerDetails = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return next(new ApiError(404, 'Customer not found'));

    const identityAlternatives = [];
    if (customer.userId) identityAlternatives.push({ userId: customer.userId });
    if (customer.email?.trim()) identityAlternatives.push({ 'customer.email': { $regex: `^${customer.email.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
    if (customer.phone?.trim()) identityAlternatives.push({ 'customer.phone': customer.phone.trim() });
    const identityFilter = identityAlternatives.length > 1 ? { $or: identityAlternatives } : identityAlternatives[0] || null;
    let orders = identityFilter ? await Order.find(identityFilter).sort({ createdAt: -1 }) : [];
    if (!customer.userId && !customer.email?.trim() && customer.phone?.replace(/\D/g, '')) {
      const allOrders = await Order.find({ 'customer.phone': { $exists: true, $ne: '' } }).sort({ createdAt: -1 });
      const normalizedPhone = customer.phone.replace(/\D/g, '');
      orders = allOrders.filter(order => order.customer.phone.replace(/\D/g, '') === normalizedPhone);
    }
    const counts = Object.fromEntries(statusCounts.map(status => [status, 0]));
    for (const order of orders) {
      if (Object.hasOwn(counts, order.orderStatus)) counts[order.orderStatus] += 1;
    }

    const deliveredRevenuePKR = orders
      .filter(order => order.orderStatus === 'DELIVERED')
      .reduce((sum, order) => sum + Number(order.grossTotalPKR || 0), 0);
    const bookedOrderValuePKR = orders
      .filter(order => !['CANCELLED', 'RETURNED'].includes(order.orderStatus))
      .reduce((sum, order) => sum + Number(order.grossTotalPKR || 0), 0);

    return res.json({
      success: true,
      data: {
        ...serializeCustomer(customer),
        orderCounts: counts,
        orderCount: orders.length,
        deliveredRevenuePKR,
        totalOrderValuePKR: orders.reduce((sum, order) => sum + Number(order.grossTotalPKR || 0), 0),
        bookedOrderValuePKR,
        lastOrderAt: orders[0]?.createdAt || null,
        orders: orders.map(order => ({ ...order.toObject(), id: order._id.toString() })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    const orders = await Order.find().select('userId customer.email orderStatus grossTotalPKR createdAt');
    const statsByIdentity = new Map();
    for (const order of orders) {
      const key = orderIdentity(order);
      const stats = statsByIdentity.get(key) || {
        orderCount: 0,
        totalSpentPKR: 0,
        totalOrderValuePKR: 0,
        bookedOrderValuePKR: 0,
        lastOrderAt: null,
        orderCounts: Object.fromEntries(statusCounts.map(status => [status, 0])),
      };
      stats.orderCount += 1;
      stats.totalOrderValuePKR += Number(order.grossTotalPKR || 0);
      if (order.orderStatus === 'DELIVERED') stats.totalSpentPKR += Number(order.grossTotalPKR || 0);
      if (!['CANCELLED', 'RETURNED'].includes(order.orderStatus)) stats.bookedOrderValuePKR += Number(order.grossTotalPKR || 0);
      if (Object.hasOwn(stats.orderCounts, order.orderStatus)) stats.orderCounts[order.orderStatus] += 1;
      if (!stats.lastOrderAt || order.createdAt > stats.lastOrderAt) stats.lastOrderAt = order.createdAt;
      statsByIdentity.set(key, stats);
    }
    const data = customers.map(customer => {
      const identity = customerIdentity(customer);
      const stats = statsByIdentity.get(identity) || {
        orderCount: 0,
        totalSpentPKR: 0,
        totalOrderValuePKR: 0,
        bookedOrderValuePKR: 0,
        lastOrderAt: null,
        orderCounts: Object.fromEntries(statusCounts.map(status => [status, 0])),
      };
      return { ...serializeCustomer(customer), ...stats };
    });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};
