import Setting from '../models/Setting.js';

const serializeSetting = setting => {
  const doc = setting?.toObject ? setting.toObject() : setting;
  const { adminSecretKey: _legacyAdminSecret, ...safeSettings } = doc;
  return {
    ...safeSettings,
    id: doc._id ? doc._id.toString() : doc.id || null
  };
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findOne() || await Setting.create({});
    res.json({ success: true, data: serializeSetting(settings) });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      'storeName', 'baseCurrency', 'currencySymbol', 'supportPhone', 'whatsappPhone', 'supportEmail',
      'warehouseAddress', 'lahoreAddress', 'maxCodLimitPKR', 'otpVerificationEnabled',
      'maintenanceMode'
    ];
    const settingsUpdate = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );
    for (const field of ['supportPhone', 'whatsappPhone']) {
      if (settingsUpdate[field] !== undefined) {
        if (typeof settingsUpdate[field] !== 'string' || settingsUpdate[field].replace(/\D/g, '').length < 7 || settingsUpdate[field].replace(/\D/g, '').length > 15) {
          return res.status(400).json({ success: false, error: `${field === 'supportPhone' ? 'Call phone' : 'WhatsApp number'} must contain 7 to 15 digits` });
        }
        settingsUpdate[field] = settingsUpdate[field].trim();
      }
    }
    const existing = await Setting.findOne();
    if (!existing) {
      const created = await Setting.create(settingsUpdate);
      return res.json({ success: true, message: 'Settings saved and synchronized', data: serializeSetting(created) });
    }

    const updated = await Setting.findByIdAndUpdate(existing._id, settingsUpdate, { new: true, runValidators: true });
    res.json({ success: true, message: 'Settings saved and synchronized', data: serializeSetting(updated) });
  } catch (error) {
    next(error);
  }
};
