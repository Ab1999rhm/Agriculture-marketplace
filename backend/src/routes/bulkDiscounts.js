const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    console.log('GET /api/bulk-discounts - farmerId:', farmerId);
    let query = db.collection('bulkDiscounts');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('GET /api/bulk-discounts - returning', items.length, 'items');
    res.json(items);
  } catch (error) {
    console.error('GET /api/bulk-discounts error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('bulkDiscounts').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Bulk discount not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, productId, product, minQuantity, discountPercent, active, originalPrice } = req.body;
    
    console.log('POST /api/bulk-discounts - Request body:', { farmerId, productId, product, minQuantity, discountPercent, active, originalPrice });
    
    // Validation: required fields
    if (!farmerId) {
      console.log('Validation failed: missing farmerId');
      return res.status(400).json({ error: 'farmerId is required' });
    }
    if (!productId) {
      console.log('Validation failed: missing productId');
      return res.status(400).json({ error: 'productId is required' });
    }
    if (!product) {
      console.log('Validation failed: missing product name');
      return res.status(400).json({ error: 'product name is required' });
    }
    if (!minQuantity || minQuantity <= 0) {
      console.log('Validation failed: invalid minQuantity');
      return res.status(400).json({ error: 'minQuantity must be greater than 0' });
    }
    if (!discountPercent || discountPercent <= 0 || discountPercent > 100) {
      console.log('Validation failed: invalid discountPercent');
      return res.status(400).json({ error: 'discountPercent must be between 1 and 100' });
    }
    
    const docRef = await db.collection('bulkDiscounts').add({
      farmerId,
      productId,
      product,
      minQuantity,
      discountPercent,
      originalPrice,
      active: active ?? true,
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    console.log('Bulk discount saved successfully:', { id: doc.id, ...doc.data() });
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error saving bulk discount:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { productId, product, minQuantity, discountPercent, active, originalPrice } = req.body;
    await db.collection('bulkDiscounts').doc(req.params.id).update({
      productId,
      product,
      minQuantity,
      discountPercent,
      active,
      originalPrice,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection('bulkDiscounts').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('bulkDiscounts').doc(req.params.id).delete();
    res.json({ message: 'Bulk discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
