import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'LAPTOPIA Hardwares' },
    baseCurrency: { type: String, default: 'PKR' },
    currencySymbol: { type: String, default: 'Rs.' },
    supportPhone: { type: String, default: '+92 345 800 5566' },
    supportEmail: { type: String, default: 'orders@laptopia.com.pk' },
    warehouseAddress: { type: String, default: 'Commercial Area, Phase 6, DHA, Karachi, Sindh' },
    lahoreAddress: { type: String, default: 'Suite 402, Precision Tech Tower, Main Boulevard, Gulberg III, Lahore' },
    maxCodLimitPKR: { type: Number, default: 500000 },
    otpVerificationEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    adminSecretKey: { type: String, default: 'laptopia2025' }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
