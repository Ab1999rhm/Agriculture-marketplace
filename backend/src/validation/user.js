// backend/src/validation/user.js
const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required().min(2),
  role: Joi.string().valid('farmer', 'buyer').required(),
  phone: Joi.string().required().pattern(/^(09|\+2519)\d{8}$/),
  location: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { signupSchema, loginSchema };
