// backend/src/controllers/paymentController.js
const { db } = require('../services/firebase');
const featureFlags = require('../services/featureFlags');

exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, phoneNumber, amount } = req.body;

    // Check if CBE Birr is enabled
    if (!featureFlags.ENABLE_CBE_BIRR) {
      return res.status(403).json({ error: 'CBE Birr payment module is currently disabled by system administrator.' });
    }

    // 1. Fetch order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data();
    if (order.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only pay for your own orders' });
    }

    // 2. Simulate external API call to CBE Birr
    console.log(`[CBE Birr API] Sending payment request of ${amount} ETB to phone ${phoneNumber} for Order ${orderId}...`);
    
    // Check phone format
    if (!phoneNumber || !phoneNumber.match(/^(09|\+2519)\d{8}$/)) {
      return res.status(400).json({ error: 'Invalid CBE Birr registered phone number' });
    }

    // Simulate success
    const transactionId = 'TXN-CBE-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    
    // 3. Update order payment status and logistics
    await db.collection('orders').doc(orderId).update({
      paymentStatus: 'paid',
      transactionId,
      status: 'confirmed',
      'logistics.status': 'ready_for_pickup',
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'CBE Birr payment simulated successfully',
      transactionId,
      orderId,
      amount,
      status: 'paid'
    });
  } catch (error) {
    next(error);
  }
};

exports.cbeWebhook = async (req, res, next) => {
  try {
    if (!featureFlags.ENABLE_CBE_BIRR) {
      return res.status(403).json({ error: 'CBE Birr payment module disabled.' });
    }

    // Typical payload structure from a bank webhook
    const { TransactionId, OrderId, Status, Amount, PhoneNumber } = req.body;
    console.log(`[CBE Birr Webhook] Received notification for Order ${OrderId}, Status: ${Status}, Amount: ${Amount}`);

    if (Status === 'Completed') {
      const orderDoc = await db.collection('orders').doc(OrderId).get();
      if (orderDoc.exists) {
        await db.collection('orders').doc(OrderId).update({
          paymentStatus: 'paid',
          transactionId: TransactionId,
          status: 'confirmed',
          'logistics.status': 'ready_for_pickup',
          updatedAt: new Date().toISOString()
        });
        return res.status(200).json({ status: 'success', message: 'Order payment processed' });
      } else {
        return res.status(404).json({ status: 'error', message: 'Order not found' });
      }
    }

    res.status(200).json({ status: 'ignored', message: 'Non-completed transaction status' });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentConfig = async (req, res, next) => {
  res.status(200).json({
    cbeBirrEnabled: featureFlags.ENABLE_CBE_BIRR,
    telebirrEnabled: featureFlags.ENABLE_TELEBIRR,
    codEnabled: true
  });
};
