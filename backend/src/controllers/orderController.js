// backend/src/controllers/orderController.js
const { db } = require('../services/firebase');

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

    const totalPrice = product.price * quantity;
    const orderId = 'ord_' + Math.random().toString(36).substring(2, 11);

    const newOrder = {
      id: orderId,
      productId,
      productName: product.name,
      productUnit: product.unit,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      buyerId,
      buyerName,
      quantity,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'awaiting_payment',
      shippingAddress,
      pickupPointId: pickupPointId || 'central_hub_01', // default pickup hub
      status: 'pending',
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
    } else if (status === 'shipped') {
      updateData['logistics.status'] = 'in_transit';
    } else if (status === 'delivered') {
      updateData['logistics.status'] = 'delivered';
      updateData.paymentStatus = 'paid'; // COD orders get paid on delivery
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
