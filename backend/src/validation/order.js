// backend/src/validation/order.js
const Joi = require('joi');

const orderSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  paymentMethod: Joi.alternatives().try(
    Joi.string().valid('CBE_BIRR', 'TELEBIRR', 'COD', 'AWASH'),
    Joi.string().pattern(/^BANK_/)
  ).required(),
  shippingAddress: Joi.string().required().min(1),
  pickupPointId: Joi.string().allow('', null),
  depositAmount: Joi.number().allow(null, 0),
  balanceAmount: Joi.number().allow(null, 0),
  depositPercent: Joi.number().allow(null, 0),
  paymentStage: Joi.string().allow('', null),
  depositPaid: Joi.boolean().allow(null),
  paymentSplit: Joi.boolean().allow(null),
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled').required()
});

module.exports = { orderSchema, updateOrderSchema };
