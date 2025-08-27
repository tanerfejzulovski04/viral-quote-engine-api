const express = require('express');
const router = express.Router();
const OpenAIService = require('../services/OpenAIService');
const { validateRewriteRequest } = require('../middleware/validation');

const openAIService = new OpenAIService();

router.post('/rewrite', validateRewriteRequest, async (req, res) => {
  try {
    const { text, style } = req.body;
    
    const variants = await openAIService.rewrite(text, style);
    
    res.json({
      variants: variants
    });
  } catch (error) {
    console.error('Error in /api/ai/rewrite:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate text variants'
    });
  }
});

module.exports = router;