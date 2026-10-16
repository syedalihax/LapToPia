import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    value: { type: String, required: true, trim: true },
    icon: { type: String, default: 'category' },
    image: { type: String, trim: true, default: '' },
    catalogMain: { type: Boolean, default: false },
    subcategories: [subcategorySchema]
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
