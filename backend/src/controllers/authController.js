// backend/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { admin, db, isMock } = require('../services/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'local_secret';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldName = file.fieldname;
    let uploadDir;
    
    if (fieldName === 'nationalId') {
      uploadDir = path.join(__dirname, '../../uploads/national-ids');
    } else {
      uploadDir = path.join(__dirname, '../../uploads/licenses');
    }
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fieldName = file.fieldname === 'nationalId' ? 'national-id' : 'license';
    cb(null, fieldName + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and PDF files are allowed'));
    }
  }
}).fields([
  { name: 'nationalId', maxCount: 1 },
  { name: 'license', maxCount: 1 }
]);

exports.upload = upload;

exports.register = async (req, res, next) => {
  try {
    const { 
      email, 
      password, 
      name, 
      role, 
      phone, 
      location,
      farmName,
      farmSize,
      crops,
      businessName,
      businessType
    } = req.body;

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
      approved: role === 'farmer' ? false : true, // Farmers need approval, others auto-approved
      createdAt: new Date().toISOString()
    };

    // Add role-specific fields to user profile
    if (role === 'farmer') {
      userProfile.farmName = farmName || '';
      userProfile.farmSize = farmSize || '';
      userProfile.crops = crops || '';
    } else if (role === 'buyer') {
      userProfile.businessName = businessName || '';
      userProfile.businessType = businessType || 'retailer';
    }

    // Handle national ID file (for both farmers and buyers)
    if (req.files && req.files.nationalId) {
      userProfile.nationalIdFile = `/uploads/national-ids/${req.files.nationalId[0].filename}`;
    }

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
        farmName: farmName || '',
        farmSize: farmSize || '',
        crops: crops ? crops.split(',').map(c => c.trim()) : [],
        coordinates: '',
        bio: '',
        createdAt: new Date().toISOString()
      });
      
      // Create notification for all admins about new farmer registration
      const adminsSnapshot = await db.collection('users').where('role', '==', 'admin').get();
      if (!adminsSnapshot.empty) {
        const admins = adminsSnapshot.docs.map(doc => doc.data());
        for (const admin of admins) {
          await db.collection('notifications').add({
            id: 'notif_' + Date.now() + '_' + admin.id,
            type: 'new_farmer',
            title: 'New Farmer Registration',
            message: `${name} has registered as a farmer and is awaiting approval.`,
            userId: admin.id,
            userName: name,
            userEmail: email,
            role: 'farmer',
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // If buyer, create buyer profile entry
    if (role === 'buyer') {
      await db.collection('buyers').doc(userId).set({
        id: userId,
        name,
        phone,
        location,
        businessName: businessName || '',
        businessType: businessType || 'retailer',
        licenseFile: req.file ? `/uploads/licenses/${req.file.filename}` : '',
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
