// backend/src/routes/payments.js
const express = require('express');
const { processPayment, cbeWebhook, getPaymentConfig } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/pay', requireAuth, processPayment);
router.post('/webhook/cbe', cbeWebhook);
router.get('/config', getPaymentConfig);

module.exports = router;
