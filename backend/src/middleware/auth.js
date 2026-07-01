// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { admin, isMock, db } = require('../services/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'local_secret';

module.exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    req.user = null;
    return next();
  }

  // 1. Try local mock JWT first (or if isMock is true)
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch current user data from database to get latest approval status
    if (isMock && decoded.id) {
      try {
        const userDoc = await db.collection('users').doc(decoded.id).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          req.user = {
            ...decoded,
            approved: userData.approved || false,
            suspended: userData.suspended || false
          };
        } else {
          req.user = decoded;
        }
      } catch (dbErr) {
        console.error('Error fetching user data:', dbErr.message);
        req.user = decoded;
      }
    } else {
      req.user = decoded;
    }
    return next();
  } catch (err) {
    // If it failed and we are not in mock mode, try verifying with Firebase Admin
    if (!isMock) {
      try {
        const decodedClaims = await admin.auth().verifyIdToken(token);
        req.user = {
          id: decodedClaims.uid,
          email: decodedClaims.email,
          role: decodedClaims.role || 'buyer', // Role can be stored in custom claims
          name: decodedClaims.name || ''
        };
        return next();
      } catch (fbErr) {
        console.error('Firebase token verification failed:', fbErr.message);
      }
    }
  }

  // If token was provided but failed verification, return 401
  return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
};

module.exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  next();
};

module.exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
    }
    next();
  };
};

module.exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Requires admin role' });
  }
  next();
};
