// backend/src/routes/auth.js
const express = require('express');
const { register, login, getMe, uploadLicense } = require('../controllers/authController');
const { validateBody } = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../validation/user');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', uploadLicense, register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', requireAuth, getMe);

module.exports = router;
