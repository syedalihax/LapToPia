import ApiError from '../utils/ApiError.js';

export default function errorMiddleware(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  if (err.name === 'MulterError') {
    const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Each image must be 5 MB or smaller'
      : err.code === 'LIMIT_FILE_COUNT'
        ? 'Maximum 5 images can be uploaded at once'
        : err.message;
    return res.status(statusCode).json({ success: false, error: message });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(field => field.message);
    return res.status(400).json({
      success: false,
      error: messages[0] || 'Validation failed'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate value detected'
    });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }

  return res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
}
