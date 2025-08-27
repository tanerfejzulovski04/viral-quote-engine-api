const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { users, JWT_SECRET, APIError } = require('../middleware/auth');
const { validate, loginSchema } = require('../utils/validation');

// POST /auth/login - Authenticate user and return JWT token
router.post('/login', validate(loginSchema), async (req, res, next) => {
  const { username, password } = req.validatedBody;
  
  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
    return next(new APIError('INVALID_CREDENTIALS', 'Invalid username or password', 401));
  }
  
  // For demo purposes, we'll use a simple password check
  // In production, you'd use bcrypt.compare(password, user.password)
  const isValidPassword = password === 'admin123' || password === 'user123';
  
  if (!isValidPassword) {
    return next(new APIError('INVALID_CREDENTIALS', 'Invalid username or password', 401));
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.success({
    token,
    user: {
      id: user.id,
      username: user.username
    }
  });
});

// POST /auth/verify - Verify JWT token
router.post('/verify', (req, res, next) => {
  const { token } = req.body;
  
  if (!token) {
    return next(new APIError('TOKEN_REQUIRED', 'Token is required', 400));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.success({
      valid: true,
      user: {
        id: decoded.id,
        username: decoded.username
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;