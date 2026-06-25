// backend/src/controllers/buyerController.js
const { db } = require('../services/firebase');

exports.getBuyerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists || doc.data().role !== 'buyer') {
      return res.status(404).json({ error: 'Buyer profile not found' });
    }
    const data = doc.data();
    delete data.passwordHash;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateBuyer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    const { name, phone, location } = req.body;
    const updateData = {
      name,
      phone,
      location,
      updatedAt: new Date().toISOString()
    };

    await db.collection('users').doc(id).update(updateData);
    res.status(200).json({ id, ...updateData });
  } catch (error) {
    next(error);
  }
};
