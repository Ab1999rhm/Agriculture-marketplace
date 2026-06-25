// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/approve', adminController.approveUser);
router.put('/users/:id/suspend', adminController.suspendUser);
router.delete('/users/:id', adminController.deleteUser);

// Marketplace monitoring
router.get('/analytics', adminController.getAnalytics);
router.get('/disputes', adminController.getDisputes);
router.put('/disputes/:id/resolve', adminController.resolveDispute);

// Bulletin management
router.post('/bulletins', adminController.createBulletin);
router.put('/bulletins/:id', adminController.updateBulletin);
router.delete('/bulletins/:id', adminController.deleteBulletin);

// System maintenance
router.get('/system/health', adminController.getSystemHealth);
router.post('/system/backup', adminController.createBackup);

module.exports = router;
