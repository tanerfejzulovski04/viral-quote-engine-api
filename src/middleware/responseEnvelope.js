/**
 * Response envelope middleware for standardized API responses
 * Success: { data, meta? }
 * Error: { error: { code, message, details? } }
 */

const responseEnvelope = (req, res, next) => {
  // Success response wrapper
  res.success = (data, meta = null, statusCode = 200) => {
    const response = { data };
    if (meta) {
      response.meta = meta;
    }
    return res.status(statusCode).json(response);
  };

  // Error response wrapper
  res.error = (code, message, details = null, statusCode = 400) => {
    const response = {
      error: {
        code,
        message
      }
    };
    if (details) {
      response.error.details = details;
    }
    return res.status(statusCode).json(response);
  };

  next();
};

module.exports = responseEnvelope;