const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all quality grades for a farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('qualityGrades');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    const grades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single quality grade
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('qualityGrades').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Quality grade not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new quality grade
router.post('/', async (req, res) => {
  try {
    const { farmerId, productName, grade, assessmentDate, inspector, notes } = req.body;
    const docRef = await db.collection('qualityGrades').add({
      farmerId,
      productName,
      grade,
      assessmentDate,
      inspector,
      notes,
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a quality grade
router.put('/:id', async (req, res) => {
  try {
    const { productName, grade, assessmentDate, inspector, notes } = req.body;
    await db.collection('qualityGrades').doc(req.params.id).update({
      productName,
      grade,
      assessmentDate,
      inspector,
      notes,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('qualityGrades').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a quality grade
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('qualityGrades').doc(req.params.id).delete();
    res.json({ message: 'Quality grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
