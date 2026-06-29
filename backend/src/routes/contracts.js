const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('contracts');
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
    const doc = await db.collection('contracts').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, productId, buyer, product, quantity, agreedPrice, deliveryDate, status } = req.body;
    
    // Validation: required fields
    if (!farmerId) {
      return res.status(400).json({ error: 'farmerId is required' });
    }
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    if (!buyer) {
      return res.status(400).json({ error: 'buyer name is required' });
    }
    if (!product) {
      return res.status(400).json({ error: 'product name is required' });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'quantity must be greater than 0' });
    }
    if (!agreedPrice || agreedPrice <= 0) {
      return res.status(400).json({ error: 'agreedPrice must be greater than 0' });
    }
    if (!deliveryDate) {
      return res.status(400).json({ error: 'deliveryDate is required' });
    }
    
    const docRef = await db.collection('contracts').add({
      farmerId,
      productId,
      buyer,
      product,
      quantity,
      agreedPrice,
      deliveryDate,
      status: status || 'pending',
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
    const { buyer, product, quantity, agreedPrice, deliveryDate, status } = req.body;
    await db.collection('contracts').doc(req.params.id).update({
      buyer,
      product,
      quantity,
      agreedPrice,
      deliveryDate,
      status,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection('contracts').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('contracts').doc(req.params.id).delete();
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
