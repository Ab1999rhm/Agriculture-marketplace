// backend/src/validation/order.js
const Joi = require('joi');

const orderSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
  paymentMethod: Joi.string().valid('CBE_BIRR', 'TELEBIRR', 'COD').required(),
  shippingAddress: Joi.string().required().min(5),
  pickupPointId: Joi.string().allow('', null)
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled').required()
});

module.exports = { orderSchema, updateOrderSchema };
