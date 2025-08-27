const Joi = require('joi');

const quoteSchema = Joi.object({
  text: Joi.string().min(10).max(500).required().messages({
    'string.base': 'Quote text must be a string',
    'string.empty': 'Quote text is required',
    'string.min': 'Quote text must be at least 10 characters long',
    'string.max': 'Quote text must be less than 500 characters',
    'any.required': 'Quote text is required'
  }),
  author: Joi.string().min(2).max(100).required().messages({
    'string.base': 'Author must be a string',
    'string.empty': 'Author is required',
    'string.min': 'Author must be at least 2 characters long',
    'string.max': 'Author must be less than 100 characters',
    'any.required': 'Author is required'
  }),
  category: Joi.string().valid('motivation', 'life', 'inspiration', 'wisdom', 'humor', 'general').default('general').messages({
    'string.base': 'Category must be a string',
    'any.only': 'Category must be one of: motivation, life, inspiration, wisdom, humor, general'
  })
});

const updateQuoteSchema = Joi.object({
  text: Joi.string().min(10).max(500).messages({
    'string.base': 'Quote text must be a string',
    'string.min': 'Quote text must be at least 10 characters long',
    'string.max': 'Quote text must be less than 500 characters'
  }),
  author: Joi.string().min(2).max(100).messages({
    'string.base': 'Author must be a string',
    'string.min': 'Author must be at least 2 characters long',
    'string.max': 'Author must be less than 100 characters'
  }),
  category: Joi.string().valid('motivation', 'life', 'inspiration', 'wisdom', 'humor', 'general').messages({
    'string.base': 'Category must be a string',
    'any.only': 'Category must be one of: motivation, life, inspiration, wisdom, humor, general'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be less than 50 characters',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return next(error);
    }
    
    req.validatedBody = value;
    next();
  };
};

module.exports = {
  quoteSchema,
  updateQuoteSchema,
  loginSchema,
  validate
};