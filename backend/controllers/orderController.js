import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import { validateOrderInput } from '../validators/orderValidator.js';

const allowedStatuses = ['PENDING_COD', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

const serializeOrder = order => {
  const doc = order?.toObject ? order.toObject() : order;
  return {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id || null
  };
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders.map(serializeOrder) });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderNumber: req.params.id }]
    });

    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    res.json({ success: true, data: serializeOrder(order) });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const errors = validateOrderInput(req.body);
    if (errors.length > 0) {
      return next(new ApiError(400, errors[0]));
    }

    const { customer, items, grossTotalPKR, courier } = req.body;
    const customerData = {
      fullName: customer.fullName,
      email: customer.email || '',
      phone: customer.phone || '',
      province: customer.province || 'Sindh',
      city: customer.city || 'Karachi',
      area: customer.area || '',
      streetAddress: customer.streetAddress || '',
      landmark: customer.landmark || '',
      postalCode: customer.postalCode || ''
    };

    const normalizedItems = items.map(item => ({
      productId: item.productId || item.id || item.sku || '',
      title: item.title || 'Product',
      sku: item.sku || '',
      qty: Number(item.qty || 1),
      unitPricePKR: Number(item.pricePKR || item.unitPricePKR || 0),
      image: item.image || item.images?.[0] || ''
    }));

    for (const item of normalizedItems) {
      if (!item.productId) {
        continue;
      }

      const product = await Product.findOne({ $or: [{ _id: item.productId }, { sku: item.sku || item.productId }] });
      if (!product) {
        continue;
      }

      if (product.stockQuantity < item.qty) {
        return next(new ApiError(400, `${product.title} does not have enough stock available`));
      }

      product.stockQuantity = product.stockQuantity - item.qty;
      product.status = product.stockQuantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';
      await product.save();
    }

    const cityCode = String(customerData.city || 'KHI').slice(0, 3).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LP-${randomSuffix}-${cityCode}`;

    const order = await Order.create({
      orderNumber,
      customer: customerData,
      items: normalizedItems,
      grossTotalPKR: Number(grossTotalPKR || 0),
      paymentMethod: 'CASH_ON_DELIVERY',
      courier: courier || 'TCS_EXPRESS',
      orderStatus: 'PENDING_COD'
    });

    const customerQuery = customerData.phone || customerData.email;
    if (customerQuery) {
      const existing = await Customer.findOne({
        $or: [{ phone: customerData.phone }, { email: customerData.email }]
      });

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpentPKR += Number(grossTotalPKR || 0);
        existing.city = customerData.city || existing.city;
        existing.province = customerData.province || existing.province;
        existing.address = customerData.streetAddress || existing.address;
        existing.name = customerData.fullName || existing.name;
        await existing.save();
      } else {
        await Customer.create({
          name: customerData.fullName,
          email: customerData.email,
          phone: customerData.phone,
          city: customerData.city,
          province: customerData.province,
          address: `${customerData.streetAddress || ''}, ${customerData.area || ''}`.trim(),
          totalSpentPKR: Number(grossTotalPKR || 0),
          ordersCount: 1,
          tier: 'FIRST TIME'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      data: serializeOrder(order)
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!allowedStatuses.includes(status)) {
      return next(new ApiError(400, `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`));
    }

    const order = await Order.findOne({ $or: [{ _id: req.params.id }, { orderNumber: req.params.id }] });
    if (!order) {
      return next(new ApiError(404, 'Order not found'));
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: serializeOrder(order)
    });
  } catch (error) {
    next(error);
  }
};
