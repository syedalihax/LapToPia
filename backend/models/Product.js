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
    slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, default: 'Laptops' },
    subcategory: { type: String, trim: true, default: '' },
    subcategorySlug: { type: String, trim: true, lowercase: true, default: '' },
    brand: { type: String, default: 'Custom Build' },
    pricePKR: { type: Number, required: true, min: 0.01 },
    originalPricePKR: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, default: 0, min: 0, validate: Number.isInteger },
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
