import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      callback(new ApiError(400, 'Only image files are allowed'));
      return;
    }
    callback(null, true);
  }
});

export default imageUpload;