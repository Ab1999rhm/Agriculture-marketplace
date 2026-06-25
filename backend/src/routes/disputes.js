const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all disputes
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('disputes').get();
    const disputes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single dispute
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('disputes').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new dispute
router.post('/', async (req, res) => {
  try {
    const { orderId, type, description, reporterId, reporterName, reportedPartyId, reportedPartyName } = req.body;
    const docRef = await db.collection('disputes').add({
      orderId,
      type,
      description,
      reporterId,
      reporterName,
      reportedPartyId,
      reportedPartyName,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve a dispute
router.put('/:id/resolve', async (req, res) => {
  try {
    const { resolution, resolvedBy } = req.body;
    await db.collection('disputes').doc(req.params.id).update({
      status: 'resolved',
      resolution,
      resolvedBy,
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('disputes').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a dispute
router.put('/:id', async (req, res) => {
  try {
    const { type, description, status } = req.body;
    await db.collection('disputes').doc(req.params.id).update({
      type,
      description,
      status,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('disputes').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a dispute
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('disputes').doc(req.params.id).delete();
    res.json({ message: 'Dispute deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
