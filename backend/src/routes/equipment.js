const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all equipment for a farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('equipment');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single equipment item
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('equipment').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new equipment
router.post('/', async (req, res) => {
  try {
    const { farmerId, equipmentName, type, status, purchaseDate, lastMaintenance, notes } = req.body;
    const docRef = await db.collection('equipment').add({
      farmerId,
      equipmentName,
      type,
      status,
      purchaseDate,
      lastMaintenance,
      notes,
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const { equipmentName, type, status, purchaseDate, lastMaintenance, notes } = req.body;
    await db.collection('equipment').doc(req.params.id).update({
      equipmentName,
      type,
      status,
      purchaseDate,
      lastMaintenance,
      notes,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('equipment').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('equipment').doc(req.params.id).delete();
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
