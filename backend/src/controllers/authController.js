// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { admin, db, isMock } = require('../services/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'local_secret';

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, role, phone, location } = req.body;

    // Validate role
    const validRoles = ['farmer', 'buyer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be farmer, buyer, or admin' });
    }

    // Check if user already exists in Firestore
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.docs.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let userId;

    if (!isMock) {
      // Register with Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
        phoneNumber: phone.startsWith('+251') ? phone : `+251${phone.substring(1)}`
      });
      userId = userRecord.uid;
      // Set custom claims for role
      await admin.auth().setCustomUserClaims(userId, { role });
    } else {
      // Mock mode ID generation
      userId = 'user_' + Math.random().toString(36).substring(2, 11);
    }

    const userProfile = {
      id: userId,
      email,
      name,
      role,
      phone,
      location,
      createdAt: new Date().toISOString()
    };

    // Store profile in Firestore 'users' collection
    await db.collection('users').doc(userId).set({
      ...userProfile,
      passwordHash // Only used/stored for mock mode verification or fallback
    });

    // If farmer, also create an initial farmer profile entry in 'farmers' collection
    if (role === 'farmer') {
      await db.collection('farmers').doc(userId).set({
        id: userId,
        name,
        phone,
        location,
        coordinates: '',
        crops: [],
        bio: '',
        createdAt: new Date().toISOString()
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role, name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userProfile
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user from Firestore
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.docs.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove passwordHash before sending user details
    const userResponse = { ...user };
    delete userResponse.passwordHash;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userDoc = await db.collection('users').doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    const user = userDoc.data();
    delete user.passwordHash;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
