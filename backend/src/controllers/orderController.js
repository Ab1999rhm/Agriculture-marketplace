// backend/src/controllers/orderController.js
const { db } = require('../services/firebase');
const { createNotification } = require('./notificationController');

exports.createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, paymentMethod, shippingAddress, pickupPointId } = req.body;
    const buyerId = req.user.id;
    const buyerName = req.user.name || 'Unknown Buyer';

    // 1. Fetch product
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productDoc.data();
    if (product.quantity < quantity) {
      return res.status(400).json({ error: `Insufficient quantity available. Current stock: ${product.quantity}` });
    }

    // Check for auction/contract/pre-harvest pricing
    let unitPrice = product.price;
    let sellingMode = null;
    
    const auctionSnap = await db.collection('auctions')
      .where('productId', '==', productId)
      .where('auctionStatus', '==', 'live')
      .limit(1).get();
    if (!auctionSnap.empty) {
      const auction = auctionSnap.docs[0].data();
      unitPrice = auction.currentBid || auction.startingPrice;
      sellingMode = 'auction';
    }
    
    const contractSnap = await db.collection('contracts')
      .where('productId', '==', productId)
      .where('status', '==', 'pending')
      .limit(1).get();
    if (!contractSnap.empty && !sellingMode) {
      const contract = contractSnap.docs[0].data();
      unitPrice = contract.agreedPrice;
      sellingMode = 'contract';
    }
    
    const preHarvestSnap = await db.collection('preHarvestSales')
      .where('productId', '==', productId)
      .where('status', '==', 'open')
      .limit(1).get();
    let preHarvestData = null;
    if (!preHarvestSnap.empty && !sellingMode) {
      preHarvestData = preHarvestSnap.docs[0].data();
      unitPrice = preHarvestData.price;
      sellingMode = 'pre-harvest';
    }

    // Calculate bulk discount if applicable (only for regular sales)
    let finalPrice = unitPrice * quantity;
    let discountAmount = 0;
    let discountPercent = 0;
    
    if (!sellingMode && product.bulkDiscount && product.bulkDiscount.active && quantity >= product.bulkDiscount.minQuantity) {
      discountPercent = product.bulkDiscount.discountPercent;
      discountAmount = (product.price * quantity) * (discountPercent / 100);
      finalPrice = (product.price * quantity) - discountAmount;
    }
    
    const totalPrice = finalPrice;
    const orderId = 'ord_' + Math.random().toString(36).substring(2, 11);

    const buyerDoc = await db.collection('users').doc(buyerId).get();
    let buyerPhone = '';
    let buyerEmail = req.user.email || '';
    if (buyerDoc.exists) {
      const buyerData = buyerDoc.data();
      buyerPhone = buyerData.phone || '';
      buyerEmail = buyerData.email || buyerEmail;
    }

    // Fetch farmer's bank accounts
    const farmerDoc = await db.collection('farmers').doc(product.farmerId).get();
    let farmerBankAccounts = [];
    let bankNames = [];
    if (farmerDoc.exists) {
      const farmerData = farmerDoc.data();
      farmerBankAccounts = farmerData.bankAccounts || [];
      
      // Fetch bank details for each bank account
      if (farmerBankAccounts.length > 0) {
        const bankPromises = farmerBankAccounts.map(bankId => 
          db.collection('banks').doc(bankId).get()
        );
        const bankDocs = await Promise.all(bankPromises);
        bankNames = bankDocs
          .filter(doc => doc.exists)
          .map(doc => doc.data().name);
      }
    }

    // Calculate pre-harvest deposit if applicable
    let depositAmount = 0;
    let balanceAmount = totalPrice;
    let paymentStage = 'paid';
    let depositPercent = 0;
    let paymentSplit = false;
    
    if (sellingMode === 'pre-harvest' && preHarvestData && preHarvestData.depositPercent) {
      depositPercent = preHarvestData.depositPercent;
      depositAmount = Math.round((depositPercent / 100) * totalPrice * 100) / 100;
      balanceAmount = totalPrice - depositAmount;
      paymentStage = 'deposit';
      paymentSplit = true;
    }
    
    const newOrder = {
      id: orderId,
      productId,
      productName: product.name,
      productUnit: product.unit,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      buyerId,
      buyerName,
      buyerPhone,
      buyerEmail,
      quantity,
      unitPrice,
      totalPrice,
      sellingMode: sellingMode || 'regular',
      depositAmount,
      balanceAmount,
      depositPercent,
      paymentStage,
      paymentSplit,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'awaiting_payment',
      shippingAddress,
      pickupPointId: pickupPointId || 'central_hub_01',
      status: 'pending',
      bankAccounts: farmerBankAccounts,
      bankNames: bankNames,
      bulkDiscount: (!sellingMode && product.bulkDiscount && product.bulkDiscount.active && quantity >= product.bulkDiscount.minQuantity) ? {
        discountPercent: product.bulkDiscount.discountPercent,
        minQuantity: product.bulkDiscount.minQuantity,
        discountAmount: discountAmount,
        originalPrice: product.price * quantity,
        finalPrice: totalPrice
      } : null,
      logistics: {
        carrier: 'Hararghe Cooperative Logistics',
        trackingNumber: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
        status: 'order_placed',
        pickupPoint: pickupPointId === 'babille_hub' ? 'Babille Cooperatives Point' : 'Alem Maya Central Hub',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 days from now
      },
      createdAt: new Date().toISOString()
    };

    // 2. Deduct product quantity
    await db.collection('products').doc(productId).update({
      quantity: product.quantity - quantity
    });

    // 3. Save order
    await db.collection('orders').doc(orderId).set(newOrder);

    // 4. Log transaction for admin dashboard
    const transactionId = 'txn_' + Date.now();
    await db.collection('transactions').doc(transactionId).set({
      id: transactionId,
      orderId,
      productId,
      productName: product.name,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      buyerId,
      buyerName,
      amount: totalPrice,
      depositAmount,
      balanceAmount,
      depositPercent,
      paymentStage,
      paymentSplit,
      paymentMethod,
      bankNames: bankNames.join(', ') || 'N/A',
      bankAccounts: farmerBankAccounts,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // 5. Notify the farmer about the new order
    await createNotification({
      userId: product.farmerId,
      type: 'new_order',
      title: '📦 New Order Received',
      message: `${buyerName} ordered ${quantity} ${product.unit || 'unit(s)'} of ${product.name}.`,
      orderId
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let query = db.collection('orders');

    if (role === 'farmer') {
      query = query.where('farmerId', '==', id);
    } else if (role === 'buyer') {
      query = query.where('buyerId', '==', id);
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map(doc => doc.data());
    
    // Sort by createdAt descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = doc.data();
    if (order.buyerId !== req.user.id && order.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, confirmed, shipped, delivered, cancelled

    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = doc.data();
    
    // Role checks
    if (req.user.role === 'buyer' && status !== 'cancelled') {
      return res.status(403).json({ error: 'Buyers can only cancel orders' });
    }
    if (req.user.role === 'buyer' && status === 'cancelled' && order.status !== 'pending') {
      return res.status(400).json({ error: 'Orders can only be cancelled while pending' });
    }
    if (req.user.role === 'farmer' && order.farmerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own sales orders' });
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    // Update logistics status accordingly
    if (status === 'confirmed') {
      updateData['logistics.status'] = 'ready_for_pickup';
      updateData.paymentStatus = 'paid'; // Farmer confirmation = payment verified
      
      // Update transaction status to completed
      const transactionSnapshot = await db.collection('transactions').where('orderId', '==', id).get();
      if (!transactionSnapshot.empty) {
        const transactionDoc = transactionSnapshot.docs[0];
        await db.collection('transactions').doc(transactionDoc.id).update({
          status: 'completed',
          completedAt: new Date().toISOString()
        });
      }
    } else if (status === 'shipped') {
      updateData['logistics.status'] = 'in_transit';
      updateData.paymentStatus = 'paid';
    } else if (status === 'delivered') {
      updateData['logistics.status'] = 'delivered';
      updateData.paymentStatus = 'paid';
    } else if (status === 'cancelled') {
      updateData['logistics.status'] = 'cancelled';
      // Return stock back to product
      const productDoc = await db.collection('products').doc(order.productId).get();
      if (productDoc.exists) {
        await db.collection('products').doc(order.productId).update({
          quantity: productDoc.data().quantity + order.quantity
        });
      }
    }

    await db.collection('orders').doc(id).update(updateData);

    // Notify buyer based on status transition
    if (status === 'confirmed') {
      await createNotification({
        userId: order.buyerId,
        type: 'payment_confirmed',
        title: '✅ Payment Confirmed',
        message: `Your payment for "${order.productName}" (Order #${id.slice(-6).toUpperCase()}) has been confirmed by the farmer.`,
        orderId: id
      });
    } else if (status === 'shipped') {
      await createNotification({
        userId: order.buyerId,
        type: 'order_shipped',
        title: '🚚 Order Shipped',
        message: `Your order of "${order.productName}" (Order #${id.slice(-6).toUpperCase()}) is now in transit and on its way to you!`,
        orderId: id
      });
    }

    // Fetch updated order to return
    const updatedDoc = await db.collection('orders').doc(id).get();
    res.status(200).json(updatedDoc.data());
  } catch (error) {
    next(error);
  }
};

exports.updateLogistics = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { carrier, status, estimatedDelivery } = req.body;

    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = doc.data();
    if (order.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only the farmer or admin can update logistics' });
    }

    const updatedLogistics = {
      ...order.logistics,
      carrier: carrier || order.logistics.carrier,
      status: status || order.logistics.status,
      estimatedDelivery: estimatedDelivery || order.logistics.estimatedDelivery
    };

    await db.collection('orders').doc(id).update({
      logistics: updatedLogistics,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ id, logistics: updatedLogistics });
  } catch (error) {
    next(error);
  }
};
