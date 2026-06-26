// backend/src/validation/user.js
const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required().min(2),
  role: Joi.string().valid("farmer", "buyer", "admin").required(),
  phone: Joi.string().allow("", null),
  location: Joi.string().allow("", null),
}).unknown(true);

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

module.exports = { signupSchema, loginSchema };
