const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all crop plans for a farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('cropPlans');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    const cropPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(cropPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single crop plan
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('cropPlans').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Crop plan not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new crop plan
router.post('/', async (req, res) => {
  try {
    const { farmerId, cropType, plantingDate, harvestDate, expectedYield, notes } = req.body;
    const docRef = await db.collection('cropPlans').add({
      farmerId,
      cropType,
      plantingDate,
      harvestDate,
      expectedYield,
      notes,
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a crop plan
router.put('/:id', async (req, res) => {
  try {
    const { cropType, plantingDate, harvestDate, expectedYield, notes } = req.body;
    await db.collection('cropPlans').doc(req.params.id).update({
      cropType,
      plantingDate,
      harvestDate,
      expectedYield,
      notes,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('cropPlans').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a crop plan
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('cropPlans').doc(req.params.id).delete();
    res.json({ message: 'Crop plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
