// backend/src/controllers/farmerController.js
const { db } = require('../services/firebase');

exports.getFarmers = async (req, res, next) => {
  try {
    const snapshot = await db.collection('farmers').get();
    const farmers = snapshot.docs.map(doc => doc.data());
    res.status(200).json(farmers);
  } catch (error) {
    next(error);
  }
};

exports.getFarmerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('farmers').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    next(error);
  }
};

exports.createFarmer = async (req, res, next) => {
  try {
    // Usually created automatically during registration, but we support manual creation/update
    const { name, phone, location, coordinates, crops, bio, paymentMethods } = req.body;
    const farmerId = req.user.id; // Tied to authenticated user

    const newFarmer = {
      id: farmerId,
      name,
      phone,
      location,
      coordinates: coordinates || '',
      crops: crops || [],
      bio: bio || '',
      paymentMethods: paymentMethods || {},
      updatedAt: new Date().toISOString()
    };

    await db.collection('farmers').doc(farmerId).set(newFarmer);
    res.status(201).json(newFarmer);
  } catch (error) {
    next(error);
  }
};

exports.updateFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Authorization: User can only update their own profile
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
    }

    const { name, phone, location, coordinates, crops, bio, paymentMethods } = req.body;
    const updateData = {
      name,
      phone,
      location,
      coordinates: coordinates || '',
      crops: crops || [],
      bio: bio || '',
      paymentMethods: paymentMethods || {},
      updatedAt: new Date().toISOString()
    };

    await db.collection('farmers').doc(id).update(updateData);
    
    // Also update name/phone/location in the 'users' collection to keep in sync
    await db.collection('users').doc(id).update({
      name,
      phone,
      location
    });

    res.status(200).json({ id, ...updateData });
  } catch (error) {
    next(error);
  }
};

exports.deleteFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own profile' });
    }

    await db.collection('farmers').doc(id).delete();
    await db.collection('users').doc(id).delete();
    res.status(200).json({ message: 'Farmer profile deleted successfully' });
  } catch (error) {
    next(error);
  }
};
