const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

// 404 handler - must be registered after all routes
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found - ${req.originalUrl}`));
};

// Global exception handler - must be registered last
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }

  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl, method: req.method }, message);
  } else {
    logger.warn({ path: req.originalUrl, method: req.method }, message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
