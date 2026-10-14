import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    sku: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
    unitPricePKR: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' }
  },
  { _id: false }
);

const customerSummarySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    province: { type: String, default: 'Sindh' },
    city: { type: String, default: 'Karachi' },
    area: { type: String, default: '' },
    streetAddress: { type: String, default: '' },
    landmark: { type: String, default: '' },
    postalCode: { type: String, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: customerSummarySchema, required: true },
    items: [orderItemSchema],
    grossTotalPKR: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, default: 'CASH_ON_DELIVERY' },
    courier: { type: String, default: 'TCS_EXPRESS' },
    orderStatus: {
      type: String,
      enum: ['PENDING_COD', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING_COD'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
