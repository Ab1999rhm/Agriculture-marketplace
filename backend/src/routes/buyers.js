// backend/src/routes/buyers.js
const express = require('express');
const { getBuyerById, updateBuyer } = require('../controllers/buyerController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', requireAuth, getBuyerById);
router.put('/:id', requireAuth, updateBuyer);

module.exports = router;
