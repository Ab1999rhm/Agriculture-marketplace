// backend/src/validation/farmer.js
const Joi = require("joi");

const farmerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  phone: Joi.string().allow("", null),
  location: Joi.string().allow("", null),
  coordinates: Joi.string().allow("", null),
  crops: Joi.alternatives()
    .try(Joi.array().items(Joi.string().allow("")), Joi.string().allow(""))
    .allow(null),
  bio: Joi.string().allow("", null).max(1000),
}).unknown(true);

module.exports = { farmerSchema };
