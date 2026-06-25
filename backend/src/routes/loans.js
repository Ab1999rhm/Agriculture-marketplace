const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase');

// Get all loan applications for a farmer
router.get('/', async (req, res) => {
  try {
    const { farmerId } = req.query;
    let query = db.collection('loans');
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }
    const snapshot = await query.get();
    const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single loan application
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('loans').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Loan application not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new loan application
router.post('/', async (req, res) => {
  try {
    const { farmerId, loanType, amount, purpose, repaymentPeriod, interestRate } = req.body;
    const docRef = await db.collection('loans').add({
      farmerId,
      loanType,
      amount,
      purpose,
      repaymentPeriod,
      interestRate,
      status: 'pending',
      applicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a loan application
router.put('/:id', async (req, res) => {
  try {
    const { loanType, amount, purpose, repaymentPeriod, interestRate, status } = req.body;
    await db.collection('loans').doc(req.params.id).update({
      loanType,
      amount,
      purpose,
      repaymentPeriod,
      interestRate,
      status,
      updatedAt: new Date().toISOString()
    });
    const doc = await db.collection('loans').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a loan application
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('loans').doc(req.params.id).delete();
    res.json({ message: 'Loan application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
