// backend/src/controllers/paymentController.js
const { db } = require('../services/firebase');
const featureFlags = require('../services/featureFlags');

exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, phoneNumber, amount, paymentMethod, paymentDetails } = req.body;

    // 1. Fetch order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDoc.data();
    if (order.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only pay for your own orders' });
    }

    // 2. Simulate external API call
    const actualMethod = paymentMethod || order.paymentMethod || 'CBE_BIRR';
    let transactionId = '';
    
    if (actualMethod === 'TELEBIRR') {
      console.log(`[Telebirr API] Sending payment request of ${amount} ETB to phone ${phoneNumber} for Order ${orderId}...`);
      transactionId = 'TXN-TELE-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    } else if (actualMethod === 'AWASH') {
      console.log(`[Awash Birr API] Sending payment request of ${amount} ETB to phone ${phoneNumber} for Order ${orderId}...`);
      transactionId = 'TXN-AWASH-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    } else if (actualMethod.startsWith('BANK_')) {
      console.log(`[Bank API] Sending payment request of ${amount} ETB to account ${phoneNumber} for Order ${orderId}...`);
      transactionId = 'TXN-BANK-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    } else {
      console.log(`[CBE Birr API] Sending payment request of ${amount} ETB to phone ${phoneNumber} for Order ${orderId}...`);
      transactionId = 'TXN-CBE-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    }

    // 3. Update order payment status, method, and payment details (pending farmer confirmation)
    const updateData = {
      paymentStatus: 'awaiting_confirmation',
      transactionId,
      status: 'pending',
      paymentMethod: actualMethod,
      paymentDetails: paymentDetails || {},
      updatedAt: new Date().toISOString()
    };
    
    // Handle pre-harvest deposit payment completion
    if (order.paymentSplit && order.paymentStage === 'deposit' && amount === order.depositAmount) {
      updateData.depositPaid = true;
      updateData.paymentStage = 'balance_pending';
      updateData.paymentStatus = 'awaiting_delivery'; // Waiting for harvest/delivery
      
      // Update transaction timestamp for successful deposit
      updateData.depositCompletedAt = new Date().toISOString();
    }
    
    // Handle balance payment for pre-harvest (after harvest/delivery)
    else if (order.paymentSplit && order.paymentStage === 'balance_pending' && amount === order.balanceAmount) {
      updateData.depositPaid = true;
      updateData.paymentStage = 'completed';
      updateData.paymentStatus = 'paid';
      updateData.balanceCompletedAt = new Date().toISOString();
    }
    
    await db.collection('orders').doc(orderId).update(updateData);

    let displayMethodName = 'CBE Birr';
    if (actualMethod === 'TELEBIRR') displayMethodName = 'Telebirr';
    else if (actualMethod === 'AWASH') displayMethodName = 'Awash Birr';
    else if (actualMethod.startsWith('BANK_')) displayMethodName = 'Bank Transfer';

    res.status(200).json({
      success: true,
      message: `${displayMethodName} payment simulated successfully`,
      transactionId,
      orderId,
      amount,
      status: 'pending'
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
          paymentStatus: 'awaiting_confirmation',
          transactionId: TransactionId,
          status: 'pending',
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
    telebirrEnabled: true, // Force enabled for simulation testing
    codEnabled: true
  });
};

