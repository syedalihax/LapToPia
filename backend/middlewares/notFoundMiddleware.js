export default function notFoundMiddleware(req, res, next) {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `Route not found: ${req.originalUrl}`
    });
  }

  return next();
}
