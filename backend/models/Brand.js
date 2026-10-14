import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    tier: { type: String, default: 'VERIFIED OEM', trim: true },
    website: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Brand', brandSchema);
