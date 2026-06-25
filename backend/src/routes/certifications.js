const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all certifications for a farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('certifications');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    const certs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single certification
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('certifications').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new certification
router.post('/', async (req, res) => {
  try {
    const { farmerId, certificationName, issuingAuthority, issueDate, expiryDate, certificateNumber } = req.body;
    const docRef = await db.collection('certifications').add({
      farmerId,
      certificationName,
      issuingAuthority,
      issueDate,
      expiryDate,
      certificateNumber,
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a certification
router.put('/:id', async (req, res) => {
  try {
    const { certificationName, issuingAuthority, issueDate, expiryDate, certificateNumber } = req.body;
    await db.collection('certifications').doc(req.params.id).update({
      certificationName,
      issuingAuthority,
      issueDate,
      expiryDate,
      certificateNumber,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('certifications').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a certification
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('certifications').doc(req.params.id).delete();
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
