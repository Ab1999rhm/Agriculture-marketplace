// backend/src/validation/farmer.js
const Joi = require('joi');

const farmerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  phone: Joi.string().required().pattern(/^(09|\+2519)\d{8}$/), // Ethiopian phone format
  location: Joi.string().required().min(2).max(100),
  coordinates: Joi.string().allow('', null),
  crops: Joi.array().items(Joi.string()).min(1).required(),
  bio: Joi.string().allow('', null).max(500)
});

module.exports = { farmerSchema };
