const jwt = require('jsonwebtoken');

// Simple user store (in production, this would be a database)
const users = [
  { id: 1, username: 'admin', password: '$2b$10$XqKDjl6Kb0wWxz0cK1Y5JOZ1Xb8e1WgY6K2Z9k3D5a7Q8w4R6t9y0' }, // password: admin123
  { id: 2, username: 'user', password: '$2b$10$XqKDjl6Kb0wWxz0cK1Y5JOZ1Xb8e1WgY6K2Z9k3D5a7Q8w4R6t9y0' } // password: user123
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

class APIError extends Error {
  constructor(code, message, statusCode = 400, details = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new APIError('AUTH_REQUIRED', 'Access token is required', 401);
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    // Let the error handler deal with JWT errors
    next(err);
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      req.user = user;
    } catch (err) {
      // For optional auth, ignore invalid tokens
    }
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  users,
  JWT_SECRET,
  APIError
};