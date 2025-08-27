const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Middleware imports
const responseEnvelope = require('./middleware/responseEnvelope');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const quotesRoutes = require('./routes/quotes');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Response envelope middleware (must be before routes)
app.use(responseEnvelope);

// Health check endpoint
app.get('/health', (req, res) => {
  res.success({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.success({
    name: 'Viral Quote Engine API',
    version: '1.0.0',
    description: 'An API for managing and sharing viral quotes with standardized response envelopes',
    endpoints: {
      quotes: '/api/quotes',
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Routes
app.use('/api/quotes', quotesRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.error('NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`, null, 404);
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Viral Quote Engine API running on port ${PORT}`);
    console.log(`📖 API documentation available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  });
}

module.exports = app;