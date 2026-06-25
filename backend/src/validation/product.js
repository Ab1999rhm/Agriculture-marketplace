// backend/src/validation/product.js
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  category: Joi.string().valid('Crops', 'Livestock').required(),
  type: Joi.string().required().min(2).max(50), // e.g. Coffee, Chat, Bull, Goat
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().required().min(1).max(20), // e.g. kg, head, quintal
  harvestDate: Joi.string().isoDate().required(),
  location: Joi.string().required(),
  description: Joi.string().allow('', null).max(1000)
});

module.exports = { productSchema };
