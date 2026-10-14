import Setting from '../models/Setting.js';

const serializeSetting = setting => {
  const doc = setting?.toObject ? setting.toObject() : setting;
  return {
    ...doc,
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
    const existing = await Setting.findOne();
    if (!existing) {
      const created = await Setting.create(req.body);
      return res.json({ success: true, message: 'Settings saved and synchronized', data: serializeSetting(created) });
    }

    const updated = await Setting.findByIdAndUpdate(existing._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Settings saved and synchronized', data: serializeSetting(updated) });
  } catch (error) {
    next(error);
  }
};
