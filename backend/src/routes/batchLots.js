const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('batchLots');
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
    const doc = await db.collection('batchLots').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Batch lot not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, batchId, product, quantity, unit, harvestDate, storageLocation, status } = req.body;
    const docRef = await db.collection('batchLots').add({
      farmerId,
      batchId,
      product,
      quantity,
      unit,
      harvestDate,
      storageLocation,
      status,
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
    const { batchId, product, quantity, unit, harvestDate, storageLocation, status } = req.body;
    await db.collection('batchLots').doc(req.params.id).update({
      batchId,
      product,
      quantity,
      unit,
      harvestDate,
      storageLocation,
      status,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection('batchLots').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('batchLots').doc(req.params.id).delete();
    res.json({ message: 'Batch lot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
