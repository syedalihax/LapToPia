import mongoose from 'mongoose';

const specItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Spec' },
    value: { type: String, required: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Laptops' },
    brand: { type: String, default: 'Custom Build' },
    pricePKR: { type: Number, required: true, min: 0 },
    originalPricePKR: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    images: [{ type: String, required: true }],
    specs: [specItemSchema],
    variants: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', brand: 'text', category: 'text', sku: 'text' });

export default mongoose.model('Product', productSchema);
