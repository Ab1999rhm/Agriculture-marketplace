const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');
const { requireAuth } = require('../middleware/auth');

// Get all reviews (supports buyerId and supplierId filters)
router.get('/', async (req, res) => {
  try {
    const { buyerId, supplierId } = req.query;
    let query = db.collection('supplierReviews');
    if (buyerId) {
      query = query.where('buyerId', '==', buyerId);
    }
    if (supplierId) {
      query = query.where('supplierId', '==', supplierId);
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

// Create a new supplier review (Requires Auth)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { buyerId, buyerName, supplierId, supplierName, farmerId, farmerName, rating, comment, orderId } = req.body;
    
    // Map with fallbacks to ensure compatibility with different frontend formats
    const finalBuyerId = buyerId || req.user.id;
    const finalBuyerName = buyerName || req.user.name || 'Anonymous Buyer';
    const finalSupplierId = supplierId || farmerId;
    const finalSupplierName = supplierName || farmerName || 'Unknown Farmer';

    if (!finalSupplierId) {
      return res.status(400).json({ error: 'Supplier ID is required' });
    }

    const docRef = await db.collection('supplierReviews').add({
      buyerId: finalBuyerId,
      buyerName: finalBuyerName,
      supplierId: finalSupplierId,
      supplierName: finalSupplierName,
      rating: parseInt(rating),
      comment,
      orderId,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      createdAt: new Date().toISOString()
    });
    
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review (Requires Auth)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const doc = await db.collection('supplierReviews').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const review = doc.data();
    if (review.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own reviews' });
    }

    await db.collection('supplierReviews').doc(req.params.id).update({
      rating: parseInt(rating),
      comment,
      updatedAt: new Date().toISOString()
    });
    
    const updatedDoc = await db.collection('supplierReviews').doc(req.params.id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review (Requires Auth)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const doc = await db.collection('supplierReviews').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const review = doc.data();
    if (review.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own reviews' });
    }

    await db.collection('supplierReviews').doc(req.params.id).delete();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
