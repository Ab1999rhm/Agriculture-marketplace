// backend/src/controllers/notificationController.js
const { db } = require('../services/firebase');

/**
 * Create a notification for a specific user.
 * Exported so other controllers can call it internally.
 */
exports.createNotification = async ({ userId, type, title, message, orderId }) => {
  try {
    const notifId = 'notif_' + Math.random().toString(36).substring(2, 15);
    const notif = {
      id: notifId,
      userId,
      type,       // 'new_order' | 'payment_confirmed' | 'order_shipped' | 'order_delivered'
      title,
      message,
      orderId: orderId || null,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await db.collection('notifications').doc(notifId).set(notif);
    return notif;
  } catch (err) {
    console.error('[Notification] Failed to create:', err.message);
  }
};

/**
 * GET /api/notifications  — returns the logged-in user's notifications.
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const snapshot = await db.collection('notifications').where('userId', '==', userId).get();
    const notifs = snapshot.docs.map(d => d.data());
    // Sort newest first
    notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(notifs);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/:id/read  — marks one notification as read.
 */
exports.markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('notifications').doc(id).update({ read: true });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/read-all  — marks all of user's notifications as read.
 */
exports.markAllRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const snapshot = await db.collection('notifications').where('userId', '==', userId).where('read', '==', false).get();
    for (const doc of snapshot.docs) {
      await db.collection('notifications').doc(doc.id).update({ read: true });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
