const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all reviews for a buyer
router.get('/', async (req, res) => {
  try {
    const { buyerId } = req.query;
    let query = db.collection('supplierReviews');
    if (buyerId) {
      query = query.where('buyerId', '==', buyerId);
    }
    const snapshot = await query.get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single review
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('supplierReviews').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new supplier review
router.post('/', async (req, res) => {
  try {
    const { buyerId, supplierId, supplierName, rating, comment, orderId } = req.body;
    const docRef = await db.collection('supplierReviews').add({
      buyerId,
      supplierId,
      supplierName,
      rating,
      comment,
      orderId,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await db.collection('supplierReviews').doc(req.params.id).update({
      rating,
      comment,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('supplierReviews').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('supplierReviews').doc(req.params.id).delete();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
