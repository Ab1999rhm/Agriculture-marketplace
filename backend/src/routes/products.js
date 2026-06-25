// backend/src/routes/products.js
const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateBody } = require('../middleware/validate');
const { productSchema } = require('../validation/product');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole('farmer'), validateBody(productSchema), createProduct);
router.put('/:id', requireAuth, requireRole('farmer'), validateBody(productSchema), updateProduct);
router.delete('/:id', requireAuth, requireRole('farmer'), deleteProduct);

module.exports = router;
