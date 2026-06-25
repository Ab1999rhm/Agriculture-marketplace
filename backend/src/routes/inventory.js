const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all inventory items for a farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('inventory');
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

// Get a single inventory item
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('inventory').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new inventory item
router.post('/', async (req, res) => {
  try {
    const { farmerId, itemName, quantity, unit, location, category, expiryDate } = req.body;
    const docRef = await db.collection('inventory').add({
      farmerId,
      itemName,
      quantity,
      unit,
      location,
      category,
      expiryDate,
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
  try {
    const { itemName, quantity, unit, location, category, expiryDate } = req.body;
    await db.collection('inventory').doc(req.params.id).update({
      itemName,
      quantity,
      unit,
      location,
      category,
      expiryDate,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('inventory').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('inventory').doc(req.params.id).delete();
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
