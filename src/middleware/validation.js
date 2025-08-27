const validateRewriteRequest = (req, res, next) => {
  const { text, style } = req.body;
  const errors = [];

  // Check if text is provided
  if (text === undefined || text === null) {
    errors.push({
      field: 'text',
      message: 'Text is required'
    });
  } else if (typeof text !== 'string') {
    errors.push({
      field: 'text',
      message: 'Text must be a string'
    });
  } else {
    // Check if text is empty after trimming
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      errors.push({
        field: 'text',
        message: 'Text cannot be empty'
      });
    } else if (trimmedText.length > 200) {
      errors.push({
        field: 'text',
        message: 'Text cannot exceed 200 characters'
      });
    }
  }

  // Check style if provided
  if (style !== undefined && style !== null && typeof style !== 'string') {
    errors.push({
      field: 'style',
      message: 'Style must be a string'
    });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors
    });
  }

  // Store trimmed text for processing
  req.body.text = text.trim();
  next();
};

module.exports = {
  validateRewriteRequest
};