import { getCloudinary } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

const uploadBuffer = (cloudinary, file) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'laptopia/products', resource_type: 'image' },
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