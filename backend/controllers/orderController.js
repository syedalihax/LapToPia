import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Setting from '../models/Setting.js';
import ApiError from '../utils/ApiError.js';
import { validateOrderInput } from '../validators/orderValidator.js';

const allowedStatuses = ['PENDING_COD', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
const terminalStatuses = new Set(['CANCELLED', 'RETURNED']);

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

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
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

    const { customer, items, courier } = req.body;
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

    const normalizedItems = [];
    for (const item of items) {
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty < 1) {
        return next(new ApiError(400, 'Product quantity must be a positive whole number'));
      }
      const productId = item.productId || item.id;
      const product = productId
        ? await Product.findById(productId).catch(() => null)
        : item.sku ? await Product.findOne({ sku: item.sku }) : null;
      if (!product) return next(new ApiError(400, 'A product in your cart is no longer available'));

      normalizedItems.push({
        productId: product._id.toString(),
        title: product.title,
        sku: product.sku,
        qty,
        unitPricePKR: product.pricePKR,
        image: product.images?.[0] || ''
      });
    }

    const orderTotal = normalizedItems.reduce((total, item) => total + item.unitPricePKR * item.qty, 0);
    const settings = await Setting.findOne();
    if (settings?.maxCodLimitPKR && orderTotal > settings.maxCodLimitPKR) {
      return next(new ApiError(400, `Cash on Delivery orders must be below Rs. ${settings.maxCodLimitPKR.toLocaleString()}`));
    }

    const reservedProducts = [];
    try {
      for (const item of normalizedItems) {
        const reserved = await Product.findOneAndUpdate(
          { _id: item.productId, stockQuantity: { $gte: item.qty } },
          { $inc: { stockQuantity: -item.qty } },
          { new: true }
        );
        if (!reserved) throw new ApiError(400, `${item.title} does not have enough stock available`);
        reservedProducts.push({ productId: item.productId, qty: item.qty });
        await Product.updateOne({ _id: item.productId }, { $set: { status: reserved.stockQuantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK' } });
      }
    } catch (error) {
      await Promise.all(reservedProducts.map(item => Product.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: item.qty }, $set: { status: 'ACTIVE' } }
      )));
      throw error;
    }

    const cityCode = String(customerData.city || 'KHI').slice(0, 3).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LP-${randomSuffix}-${cityCode}`;

    let order;
    try {
      order = await Order.create({
        userId: req.user._id,
        orderNumber,
        customer: customerData,
        items: normalizedItems,
        grossTotalPKR: orderTotal,
        paymentMethod: 'CASH_ON_DELIVERY',
        courier: courier || 'TCS_EXPRESS',
        orderStatus: 'PENDING_COD'
      });
    } catch (error) {
      await Promise.all(reservedProducts.map(item => Product.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: item.qty }, $set: { status: 'ACTIVE' } }
      )));
      throw error;
    }

    try {
      const existing = await Customer.findOne({ userId: req.user._id });
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpentPKR += orderTotal;
        existing.city = customerData.city || existing.city;
        existing.province = customerData.province || existing.province;
        existing.address = customerData.streetAddress || existing.address;
        existing.name = customerData.fullName || existing.name;
        await existing.save();
      } else {
        await Customer.create({
          userId: req.user._id,
          name: customerData.fullName,
          email: customerData.email,
          phone: customerData.phone,
          city: customerData.city,
          province: customerData.province,
          address: `${customerData.streetAddress || ''}, ${customerData.area || ''}`.trim(),
          totalSpentPKR: orderTotal,
          ordersCount: 1,
          tier: 'FIRST TIME'
        });
      }
    } catch (customerError) {
      console.error('Unable to update customer summary for order:', customerError.message);
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

    if (order.orderStatus === status) {
      return res.json({ success: true, message: `Order already has status ${status}`, data: serializeOrder(order) });
    }
    const previousStatus = order.orderStatus;
    const wasTerminal = terminalStatuses.has(previousStatus);
    const becomesTerminal = terminalStatuses.has(status);
    const reservedProducts = [];

    if (wasTerminal && !becomesTerminal) {
      try {
        for (const item of order.items) {
          const reserved = await Product.findOneAndUpdate(
            { _id: item.productId, stockQuantity: { $gte: item.qty } },
            { $inc: { stockQuantity: -item.qty } },
            { returnDocument: 'after' }
          );
          if (!reserved) throw new ApiError(409, `Cannot reopen this order: ${item.title} does not have enough stock`);
          reservedProducts.push({ productId: item.productId, qty: item.qty, remaining: reserved.stockQuantity });
        }
      } catch (error) {
        await Promise.all(reservedProducts.map(item => Product.updateOne(
          { _id: item.productId },
          { $inc: { stockQuantity: item.qty } }
        )));
        throw error;
      }
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id, orderStatus: previousStatus },
      { $set: { orderStatus: status } },
      { returnDocument: 'after', runValidators: true }
    );
    if (!updatedOrder) {
      await Promise.all(reservedProducts.map(item => Product.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: item.qty } }
      )));
      return next(new ApiError(409, 'Order status changed by another request. Refresh and try again.'));
    }

    if (!wasTerminal && becomesTerminal) {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stockQuantity: item.qty }, $set: { status: 'ACTIVE' } }
        );
      }
    }
    if (reservedProducts.length) {
      await Promise.all(reservedProducts.map(item => Product.updateOne(
        { _id: item.productId },
        { $set: { status: item.remaining > 0 ? 'ACTIVE' : 'OUT_OF_STOCK' } }
      )));
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: serializeOrder(updatedOrder)
    });
  } catch (error) {
    next(error);
  }
};
