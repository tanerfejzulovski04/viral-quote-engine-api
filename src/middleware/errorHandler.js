/**
 * Global error handler middleware
 * Converts all types of exceptions to standardized error format
 */

const errorHandler = (err, req, res, next) => {
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details = null;
  let statusCode = 500;

  // Joi validation errors
  if (err.isJoi) {
    code = 'VALIDATION_ERROR';
    message = 'Invalid input data';
    details = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    statusCode = 400;
  }
  // JWT authentication errors
  else if (err.name === 'JsonWebTokenError') {
    code = 'AUTH_ERROR';
    message = 'Invalid authentication token';
    statusCode = 401;
  }
  else if (err.name === 'TokenExpiredError') {
    code = 'AUTH_ERROR';
    message = 'Authentication token has expired';
    statusCode = 401;
  }
  // Custom API errors
  else if (err.name === 'APIError') {
    code = err.code || 'API_ERROR';
    message = err.message;
    details = err.details || null;
    statusCode = err.statusCode || 400;
  }
  // MongoDB/Database errors
  else if (err.name === 'MongoError' || err.name === 'ValidationError') {
    code = 'DATABASE_ERROR';
    message = 'Database operation failed';
    if (process.env.NODE_ENV === 'development') {
      details = { originalError: err.message };
    }
    statusCode = 400;
  }
  // Default handling for other errors
  else if (err.message) {
    message = err.message;
    if (process.env.NODE_ENV === 'development') {
      details = { stack: err.stack };
    }
  }

  // Use response envelope if available
  if (res.error) {
    return res.error(code, message, details, statusCode);
  }

  // Fallback response if middleware not available
  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details && { details })
    }
  });
};

module.exports = errorHandler;