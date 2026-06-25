// backend/src/controllers/productController.js
const { db } = require('../services/firebase');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, type, minPrice, maxPrice, location, farmerId, search } = req.query;
    
    let query = db.collection('products');
    
    // Exact match filters
    if (category) {
      query = query.where('category', '==', category);
    }
    if (type) {
      query = query.where('type', '==', type);
    }
    if (location) {
      query = query.where('location', '==', location);
    }
    if (farmerId) {
      query = query.where('farmerId', '==', farmerId);
    }

    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => doc.data());

    // In-memory filters for range and text search (to avoid Firestore index restrictions)
    if (minPrice) {
      const min = parseFloat(minPrice);
      products = products.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      products = products.filter(p => p.price <= max);
    }
    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term)) ||
        p.type.toLowerCase().includes(term)
      );
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, type, price, quantity, unit, harvestDate, location, description } = req.body;
    const farmerId = req.user.id;
    const farmerName = req.user.name || 'Unknown Farmer';

    const productId = 'prod_' + Math.random().toString(36).substring(2, 11);

    const newProduct = {
      id: productId,
      farmerId,
      farmerName,
      name,
      category,
      type,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      unit,
      harvestDate,
      location,
      description: description || '',
      createdAt: new Date().toISOString()
    };

    if (req.file) {
      newProduct.imageUrl = `/uploads/${req.file.filename}`;
    }

    await db.collection('products').doc(productId).set(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = doc.data();
    if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only update your own products' });
    }

    const { name, category, type, price, quantity, unit, harvestDate, location, description, hidden } = req.body;
    const updateData = {
      name,
      category,
      type,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      unit,
      harvestDate,
      location,
      description: description || '',
      updatedAt: new Date().toISOString()
    };

    // Handle visibility toggle (hidden comes as string 'true'/'false' from FormData)
    if (hidden !== undefined) {
      updateData.hidden = hidden === 'true' || hidden === true;
    }


    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await db.collection('products').doc(id).update(updateData);
    res.status(200).json({ id, ...product, ...updateData });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = doc.data();
    if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own products' });
    }

    await db.collection('products').doc(id).delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
