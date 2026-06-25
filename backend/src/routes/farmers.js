// backend/src/routes/farmers.js
const express = require('express');
const { getFarmers, getFarmerById, createFarmer, updateFarmer, deleteFarmer } = require('../controllers/farmerController');
const { validateBody } = require('../middleware/validate');
const { farmerSchema } = require('../validation/farmer');

const router = express.Router();

router.get('/', getFarmers);
router.get('/:id', getFarmerById);
router.post('/', validateBody(farmerSchema), createFarmer);
router.put('/:id', validateBody(farmerSchema), updateFarmer);
router.delete('/:id', deleteFarmer);

module.exports = router;
