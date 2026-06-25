const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all wishlist items for a buyer
router.get('/', async (req, res) => {
  try {
    const { buyerId } = req.query;
    let query = db.collection('wishlist');
    if (buyerId) {
      query = query.where('buyerId', '==', buyerId);
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single wishlist item
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('wishlist').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to wishlist
router.post('/', async (req, res) => {
  try {
    const { buyerId, productId, productName, price, farmerId, farmerName } = req.body;
    const docRef = await db.collection('wishlist').add({
      buyerId,
      productId,
      productName,
      price,
      farmerId,
      farmerName,
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from wishlist
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('wishlist').doc(req.params.id).delete();
    res.json({ message: 'Item removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
