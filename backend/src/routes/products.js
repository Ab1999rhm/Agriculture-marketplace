// backend/src/routes/products.js
const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole('farmer'), upload.single('image'), createProduct);
router.put('/:id', requireAuth, requireRole('farmer'), upload.single('image'), updateProduct);
router.delete('/:id', requireAuth, requireRole('farmer'), deleteProduct);

module.exports = router;
