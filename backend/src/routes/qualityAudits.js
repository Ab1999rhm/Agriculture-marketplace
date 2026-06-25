const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all quality audits
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('qualityAudits').get();
    const audits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single quality audit
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('qualityAudits').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Quality audit not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule a new quality audit
router.post('/', async (req, res) => {
  try {
    const { target, type, scheduledDate, auditor, notes } = req.body;
    const docRef = await db.collection('qualityAudits').add({
      target,
      type,
      scheduledDate,
      auditor,
      notes,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a quality audit
router.put('/:id', async (req, res) => {
  try {
    const { target, type, scheduledDate, auditor, notes, status } = req.body;
    await db.collection('qualityAudits').doc(req.params.id).update({
      target,
      type,
      scheduledDate,
      auditor,
      notes,
      status,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('qualityAudits').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a quality audit
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('qualityAudits').doc(req.params.id).delete();
    res.json({ message: 'Quality audit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
