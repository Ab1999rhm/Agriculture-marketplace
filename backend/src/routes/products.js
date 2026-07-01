// backend/src/routes/products.js
const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Middleware to check if farmer is approved
const requireApprovedFarmer = (req, res, next) => {
  if (req.user.role === 'farmer' && !req.user.approved) {
    return res.status(403).json({ error: 'Your account is pending approval. Please wait for admin approval before posting products.' });
  }
  next();
};

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole('farmer'), requireApprovedFarmer, upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireRole('farmer'), requireApprovedFarmer, upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireRole('farmer'), deleteProduct);

module.exports = router;
