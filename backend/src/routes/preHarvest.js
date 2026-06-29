const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('preHarvestSales');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
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
    const { farmerId, productId, crop, harvestDate, quantity, price, depositPercent, status } = req.body;
    
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
    const { crop, harvestDate, quantity, price, depositPercent, status } = req.body;
    await db.collection('preHarvestSales').doc(req.params.id).update({
      crop,
      harvestDate,
      quantity,
      price,
      depositPercent,
      status,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection('preHarvestSales').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
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
