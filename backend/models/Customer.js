import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    city: { type: String, default: 'Karachi' },
    province: { type: String, default: 'Sindh' },
    address: { type: String, default: '' },
    totalSpentPKR: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    tier: { type: String, default: 'FIRST TIME' }
  },
  { timestamps: true }
);

customerSchema.index({ email: 1 }, { unique: false });
customerSchema.index({ phone: 1 }, { unique: false });

export default mongoose.model('Customer', customerSchema);
