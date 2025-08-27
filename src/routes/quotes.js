const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const { authenticateToken, optionalAuth, APIError } = require('../middleware/auth');
const { validate, quoteSchema, updateQuoteSchema } = require('../utils/validation');

// GET /quotes - Get all quotes with optional filtering
router.get('/', optionalAuth, (req, res) => {
  const { category, author, search, limit = 10, offset = 0 } = req.query;
  
  const filters = {};
  if (category) filters.category = category;
  if (author) filters.author = author;
  if (search) filters.search = search;
  
  const allQuotes = Quote.findAll(filters);
  const total = allQuotes.length;
  const quotes = allQuotes.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  const meta = {
    total,
    limit: parseInt(limit),
    offset: parseInt(offset),
    hasMore: (parseInt(offset) + parseInt(limit)) < total
  };
  
  res.success(quotes, meta);
});

// GET /quotes/random - Get a random quote
router.get('/random', optionalAuth, (req, res) => {
  const quote = Quote.getRandomQuote();
  res.success(quote);
});

// GET /quotes/categories - Get all available categories
router.get('/categories', optionalAuth, (req, res) => {
  const categories = Quote.getCategories();
  res.success(categories);
});

// GET /quotes/:id - Get a specific quote by ID
router.get('/:id', optionalAuth, (req, res, next) => {
  const { id } = req.params;
  const quote = Quote.findById(id);
  
  if (!quote) {
    return next(new APIError('QUOTE_NOT_FOUND', 'Quote not found', 404));
  }
  
  res.success(quote);
});

// POST /quotes - Create a new quote (requires authentication)
router.post('/', authenticateToken, validate(quoteSchema), (req, res) => {
  const quoteData = {
    ...req.validatedBody,
    createdBy: req.user.id
  };
  
  const quote = Quote.create(quoteData);
  res.success(quote, null, 201);
});

// PUT /quotes/:id - Update a quote (requires authentication and ownership)
router.put('/:id', authenticateToken, validate(updateQuoteSchema), (req, res, next) => {
  const { id } = req.params;
  const quote = Quote.findById(id);
  
  if (!quote) {
    return next(new APIError('QUOTE_NOT_FOUND', 'Quote not found', 404));
  }
  
  // Check if user owns the quote or is admin
  if (quote.createdBy && quote.createdBy !== req.user.id && req.user.username !== 'admin') {
    return next(new APIError('FORBIDDEN', 'You can only update your own quotes', 403));
  }
  
  const updatedQuote = Quote.update(id, req.validatedBody);
  res.success(updatedQuote);
});

// DELETE /quotes/:id - Delete a quote (requires authentication and ownership)
router.delete('/:id', authenticateToken, (req, res, next) => {
  const { id } = req.params;
  const quote = Quote.findById(id);
  
  if (!quote) {
    return next(new APIError('QUOTE_NOT_FOUND', 'Quote not found', 404));
  }
  
  // Check if user owns the quote or is admin
  if (quote.createdBy && quote.createdBy !== req.user.id && req.user.username !== 'admin') {
    return next(new APIError('FORBIDDEN', 'You can only delete your own quotes', 403));
  }
  
  Quote.delete(id);
  res.success({ message: 'Quote deleted successfully' });
});

// POST /quotes/:id/like - Like a quote
router.post('/:id/like', optionalAuth, (req, res, next) => {
  const { id } = req.params;
  const quote = Quote.findById(id);
  
  if (!quote) {
    return next(new APIError('QUOTE_NOT_FOUND', 'Quote not found', 404));
  }
  
  quote.likes += 1;
  res.success({ likes: quote.likes });
});

// POST /quotes/:id/share - Share a quote (increment share count)
router.post('/:id/share', optionalAuth, (req, res, next) => {
  const { id } = req.params;
  const quote = Quote.findById(id);
  
  if (!quote) {
    return next(new APIError('QUOTE_NOT_FOUND', 'Quote not found', 404));
  }
  
  quote.shares += 1;
  res.success({ shares: quote.shares });
});

module.exports = router;