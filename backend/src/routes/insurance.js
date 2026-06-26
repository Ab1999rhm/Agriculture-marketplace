const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('insurancePolicies');
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
    const doc = await db.collection('insurancePolicies').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Insurance policy not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { farmerId, provider, policyType, premium, coverage, expiryDate, status } = req.body;
    const docRef = await db.collection('insurancePolicies').add({
      farmerId,
      provider,
      policyType,
      premium,
      coverage,
      expiryDate,
      status: status || 'active',
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
    const { provider, policyType, premium, coverage, expiryDate, status } = req.body;
    await db.collection('insurancePolicies').doc(req.params.id).update({
      provider,
      policyType,
      premium,
      coverage,
      expiryDate,
      status,
      updatedAt: new Date().toISOString(),
    });
    const doc = await db.collection('insurancePolicies').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('insurancePolicies').doc(req.params.id).delete();
    res.json({ message: 'Insurance policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
