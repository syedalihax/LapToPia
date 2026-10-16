import { getCloudinary } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const uploadBuffer = (cloudinary, file, folder = 'laptopia/products') => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder, resource_type: 'image' },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );
  stream.end(file.buffer);
});

export const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return next(new ApiError(400, 'Select at least one image to upload'));
    }

    const cloudinary = getCloudinary();
    const uploadedImages = await Promise.all(
      req.files.map(async file => {
        const result = await uploadBuffer(cloudinary, file);
        return { url: result.secure_url, publicId: result.public_id };
      })
    );

    res.status(201).json({ success: true, data: uploadedImages });
  } catch (error) {
    next(error);
  }
};

export const uploadCategoryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Select a category image to upload'));
    }

    const cloudinary = getCloudinary();
    const result = await uploadBuffer(cloudinary, req.file, 'laptopia/categories');

    res.status(201).json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    next(error);
  }
};