// backend/src/routes/bulletins.js
const express = require('express');
const { getBulletins, getBulletinById, createBulletin } = require('../controllers/bulletinController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBulletins);
router.get('/:id', getBulletinById);
router.post('/', requireAuth, createBulletin);

module.exports = router;
