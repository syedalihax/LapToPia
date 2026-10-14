import validator from 'validator';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const serializeProfile = user => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  address: user.address || { street: '', city: '', province: '', postalCode: '' }
});

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return next(new ApiError(404, 'Account not found'));
    res.json({ success: true, data: serializeProfile(user) });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address = {} } = req.body;
    if (typeof name !== 'string' || name.trim().length < 2) {
      return next(new ApiError(400, 'Full name must be at least 2 characters'));
    }
    if (typeof email !== 'string' || !validator.isEmail(email.trim())) {
      return next(new ApiError(400, 'Enter a valid email address'));
    }
    const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';

    const normalizedEmail = email.trim().toLowerCase();
    const emailInUse = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
    if (emailInUse) return next(new ApiError(409, 'This email is already in use'));

    const updated = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        address: {
          street: typeof address.street === 'string' ? address.street.trim() : '',
          city: typeof address.city === 'string' ? address.city.trim() : '',
          province: typeof address.province === 'string' ? address.province.trim() : '',
          postalCode: typeof address.postalCode === 'string' ? address.postalCode.trim() : ''
        }
      }
    }, { new: true, runValidators: true }).select('-password');

    if (!updated) return next(new ApiError(404, 'Account not found'));
    res.json({ success: true, data: serializeProfile(updated) });
  } catch (error) {
    next(error);
  }
};