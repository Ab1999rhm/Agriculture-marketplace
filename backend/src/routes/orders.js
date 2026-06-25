// backend/src/routes/orders.js
const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus, updateLogistics } = require('../controllers/orderController');
const { validateBody } = require('../middleware/validate');
const { orderSchema, updateOrderSchema } = require('../validation/order');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, validateBody(orderSchema), createOrder);
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.put('/:id', requireAuth, validateBody(updateOrderSchema), updateOrderStatus);
router.put('/:id/logistics', requireAuth, updateLogistics);

module.exports = router;
