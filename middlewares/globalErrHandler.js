export const globalErrHandler = (err, req, res, next) => {
  const stack = err?.stack;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message;
  res.status(statusCode).json({ stack, message });
};

// 404 handler
export const notFoundHandler = (req, res, next) => {
  // const err = new Error(`Route ${req.originalUrl} not found`);
  const err = new Error(`پیدا نشد ${req.originalUrl} مسیر`);
  err.statusCode = 404;
  next(err);
};