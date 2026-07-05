const { db } = require('./firebase');

async function createNotification({ toUserId, fromUserId, fromUserName, type, title, message, relatedId }) {
  if (!toUserId || !type || !title || !message) return null;
  try {
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
    return { id: doc.id, ...doc.data() };
  } catch (e) {
    console.error('Notification create error:', e);
    return null;
  }
}

module.exports = { createNotification };
