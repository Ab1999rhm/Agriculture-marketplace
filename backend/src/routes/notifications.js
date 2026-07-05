// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();
const { verifyToken, requireAuth } = require('../middleware/auth');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const { db } = require('../services/firebase');

router.post('/', verifyToken, requireAuth, async (req, res) => {
  try {
    const { toUserId, fromUserId, fromUserName, type, title, message, relatedId } = req.body;
    if (!toUserId || !type || !title || !message) {
      return res.status(400).json({ error: 'toUserId, type, title, and message are required' });
    }
    const docRef = await db.collection('notifications').add({
      toUserId,
      fromUserId: fromUserId || null,
      fromUserName: fromUserName || 'System',
      type,
      title,
      message,
      relatedId: relatedId || null,
      read: false,
      createdAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', verifyToken, requireAuth, getNotifications);
router.put('/read-all', verifyToken, requireAuth, markAllRead);
router.put('/:id/read', verifyToken, requireAuth, markRead);

module.exports = router;
