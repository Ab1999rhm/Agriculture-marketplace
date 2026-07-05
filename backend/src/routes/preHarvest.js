const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');
const { createNotification } = require('../services/notify');

router.get('/', async (req, res) => {
  try {
    const { farmerId, buyerId } = req.query;
    let query = db.collection('preHarvestSales');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    if (buyerId) {
      query = query.where('buyerId', '==', buyerId);
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('preHarvestSales').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Pre-harvest sale not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, buyerId, buyerName, productId, crop, harvestDate, quantity, price, depositPercent, status } = req.body;
    
    // Validation: required fields
    if (!farmerId) {
      return res.status(400).json({ error: 'farmerId is required' });
    }
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    if (!crop) {
      return res.status(400).json({ error: 'crop name is required' });
    }
    if (!harvestDate) {
      return res.status(400).json({ error: 'harvestDate is required' });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'quantity must be greater than 0' });
    }
    if (!price || price <= 0) {
      return res.status(400).json({ error: 'price must be greater than 0' });
    }
    if (!depositPercent || depositPercent <= 0 || depositPercent > 100) {
      return res.status(400).json({ error: 'depositPercent must be between 1 and 100' });
    }
    
    const docRef = await db.collection('preHarvestSales').add({
      farmerId,
      buyerId: buyerId || null,
      buyerName: buyerName || null,
      productId,
      crop,
      harvestDate,
      quantity,
      price,
      depositPercent,
      status: status || 'open',
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { crop, harvestDate, quantity, price, depositPercent, status, buyerId, buyerName } = req.body;
    const updateData = {
      crop,
      harvestDate,
      quantity,
      price,
      depositPercent,
      status,
      updatedAt: new Date().toISOString(),
    };
    if (buyerId !== undefined) updateData.buyerId = buyerId;
    if (buyerName !== undefined) updateData.buyerName = buyerName;
    await db.collection('preHarvestSales').doc(req.params.id).update(updateData);
    const doc = await db.collection('preHarvestSales').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/reservation', async (req, res) => {
  try {
    const { status, buyerId, buyerName } = req.body;
    if (!status || !['reserved', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const doc = await db.collection('preHarvestSales').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Pre-harvest sale not found' });
    const sale = doc.data();
    const updateData = { status, updatedAt: new Date().toISOString() };
    if (buyerId) updateData.buyerId = buyerId;
    if (buyerName) updateData.buyerName = buyerName;
    await db.collection('preHarvestSales').doc(req.params.id).update(updateData);
    const updated = await db.collection('preHarvestSales').doc(req.params.id).get();

    if (status === 'reserved') {
      createNotification({
        toUserId: sale.farmerId,
        fromUserId: buyerId,
        fromUserName: buyerName || 'A buyer',
        type: 'reservation_made',
        title: 'New Reservation',
        message: `${buyerName || 'A buyer'} reserved ${sale.quantity} ${sale.crop} for harvest on ${sale.harvestDate}`,
        relatedId: req.params.id,
      });
    } else if (status === 'cancelled') {
      createNotification({
        toUserId: sale.farmerId,
        fromUserId: buyerId,
        fromUserName: buyerName || 'A buyer',
        type: 'reservation_cancelled',
        title: 'Reservation Cancelled',
        message: `A reservation for ${sale.crop} has been cancelled`,
        relatedId: req.params.id,
      });
    }

    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('preHarvestSales').doc(req.params.id).delete();
    res.json({ message: 'Pre-harvest sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
