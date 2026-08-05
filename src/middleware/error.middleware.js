const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  next(Object.assign(new Error(`Route not found: ${req.originalUrl}`), { statusCode: 404 }));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger[statusCode >= 500 ? 'error' : 'warn']({
    message: err.message || 'Request failed',
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  return res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode >= 500 ? 'Internal server error' : err.message || 'Internal server error',
    errors: err.errors || []
  });
};

module.exports = { notFound, errorHandler };
