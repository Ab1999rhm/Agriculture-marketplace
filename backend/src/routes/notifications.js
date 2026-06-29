// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();
const { verifyToken, requireAuth } = require('../middleware/auth');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');

router.get('/', verifyToken, requireAuth, getNotifications);
router.put('/read-all', verifyToken, requireAuth, markAllRead);
router.put('/:id/read', verifyToken, requireAuth, markRead);

module.exports = router;
