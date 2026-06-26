const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('auctions');
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
    const doc = await db.collection('auctions').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, product, startingPrice, duration, minBid, status, bids } = req.body;
    const docRef = await db.collection('auctions').add({
      farmerId,
      product,
      startingPrice,
      duration,
      minBid,
      status: status || 'active',
      bids: bids || [],
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
    const { product, startingPrice, duration, minBid, status, bids } = req.body;
    await db.collection('auctions').doc(req.params.id).update({
      product,
      startingPrice,
      duration,
      minBid,
      status,
      bids,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection('auctions').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('auctions').doc(req.params.id).delete();
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
