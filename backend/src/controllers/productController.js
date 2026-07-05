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
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched products:', products.length, 'products for farmerId:', farmerId);

    // Filter out hidden products for public marketplace
    // Only show hidden products if farmerId filter is present (farmer viewing their own products)
    if (!farmerId) {
      const beforeFilter = products.length;
      products = products.filter(p => !p.hidden);
      console.log('Filtered out hidden products:', beforeFilter, '->', products.length);
    }

    // Fetch bulk discounts and merge with products
    // If farmerId is provided, only fetch discounts for that farmer
    // If farmerId is NOT provided (marketplace), fetch ALL discounts
    let bulkDiscountsQuery = db.collection('bulkDiscounts');
    if (farmerId) {
      bulkDiscountsQuery = bulkDiscountsQuery.where('farmerId', '==', farmerId);
      console.log('Filtering bulk discounts by farmerId:', farmerId);
    } else {
      console.log('Fetching ALL bulk discounts for marketplace');
    }
    const bulkDiscountsSnapshot = await bulkDiscountsQuery.get();
    
    const bulkDiscounts = bulkDiscountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched bulk discounts:', bulkDiscounts.length, 'discounts for farmerId:', farmerId);
    console.log('Bulk discounts data:', bulkDiscounts);
    
    // Fetch active auctions and merge with products
    let auctionsQuery = db.collection('auctions').where('auctionStatus', '==', 'live');
    if (farmerId) {
      auctionsQuery = auctionsQuery.where('farmerId', '==', farmerId);
      console.log('Filtering auctions by farmerId:', farmerId);
    } else {
      console.log('Fetching ALL live auctions for marketplace');
    }
    const auctionsSnapshot = await auctionsQuery.get();
    
    const auctions = auctionsSnapshot.docs.map(doc => doc.data());
    
    // Fetch active contracts and merge with products
    let contractsQuery = db.collection('contracts').where('status', '==', 'pending');
    if (farmerId) {
      contractsQuery = contractsQuery.where('farmerId', '==', farmerId);
      console.log('Filtering contracts by farmerId:', farmerId);
    } else {
      console.log('Fetching ALL pending contracts for marketplace');
    }
    const contractsSnapshot = await contractsQuery.get();
    
    const contracts = contractsSnapshot.docs.map(doc => doc.data());
    
    // Fetch active pre-harvest sales and merge with products
    let preHarvestQuery = db.collection('preHarvestSales').where('status', '==', 'open');
    if (farmerId) {
      preHarvestQuery = preHarvestQuery.where('farmerId', '==', farmerId);
      console.log('Filtering pre-harvest sales by farmerId:', farmerId);
    } else {
      console.log('Fetching ALL open pre-harvest sales for marketplace');
    }
    const preHarvestSnapshot = await preHarvestQuery.get();
    
    const preHarvestSales = preHarvestSnapshot.docs.map(doc => doc.data());
    
    // Merge selling mode info into products
    products = products.map(product => {
      let updatedProduct = { ...product };
      
      console.log(`Processing product ${product.id} (farmerId: ${product.farmerId})`);
      
      // Check for bulk discount (must match both productId AND farmerId)
      const discount = bulkDiscounts.find(d => d.productId === product.id && d.farmerId === product.farmerId);
      console.log(`Product ${product.id} - Looking for discount with productId=${product.id}, farmerId=${product.farmerId}`);
      console.log(`Product ${product.id} - Found discount:`, discount);
      if (discount) {
        console.log(`Merging discount for product ${product.id}:`, discount);
        updatedProduct.bulkDiscount = {
          active: discount.active !== undefined ? discount.active : true,
          discountPercent: discount.discountPercent,
          minQuantity: discount.minQuantity
        };
        console.log(`Product ${product.id} after discount merge:`, updatedProduct.bulkDiscount);
      }
      
    // Check for auction (must match both productId AND farmerId)
    const auction = auctions.find(a => a.productId === product.id && a.farmerId === product.farmerId);
    if (auction) {
      updatedProduct.sellingMode = 'auction';
      updatedProduct.auctionStatus = auction.auctionStatus || 'live';
      updatedProduct.startingPrice = auction.startingPrice;
      updatedProduct.currentBid = auction.currentBid || auction.startingPrice;
      updatedProduct.auctionEndsAt = auction.auctionEndsAt;
      updatedProduct.auctionBids = auction.bids || [];
      updatedProduct.auctionId = auction.id;
      updatedProduct.minBid = auction.minBid || 50;
    }
      
      // Check for contract (must match both productId AND farmerId)
      const contract = contracts.find(c => c.productId === product.id && c.farmerId === product.farmerId);
      if (contract) {
        updatedProduct.sellingMode = 'contract';
        updatedProduct.agreedPrice = contract.agreedPrice;
        updatedProduct.contractQuantity = contract.quantity;
        updatedProduct.contractId = contract.id;
        updatedProduct.contractStatus = contract.status || 'pending';
        updatedProduct.deliveryDate = contract.deliveryDate;
      }
      
      // Check for pre-harvest sale (must match both productId AND farmerId)
      const preHarvest = preHarvestSales.find(p => p.productId === product.id && p.farmerId === product.farmerId);
      if (preHarvest) {
        updatedProduct.sellingMode = 'pre-harvest';
        updatedProduct.depositPercent = preHarvest.depositPercent;
        updatedProduct.preHarvestPrice = preHarvest.price;
        updatedProduct.preHarvestQuantity = preHarvest.quantity;
      }
      
      return updatedProduct;
    });
    
    // Log discounts that couldn't find matching products
    const productIds = new Set(products.map(p => p.id));
    bulkDiscounts.forEach(discount => {
      if (!productIds.has(discount.productId)) {
        console.log(`Discount for productId ${discount.productId} (${discount.product}) has no matching product in database`);
      }
    });

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
      hidden: false, // Explicitly set to false so products are visible by default
      createdAt: new Date().toISOString()
    };

    if (req.file) {
      newProduct.imageUrl = `/uploads/products/${req.file.filename}`;
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

    // Preserve existing imageUrl if no new file is uploaded
    if (req.file) {
      updateData.imageUrl = `/uploads/products/${req.file.filename}`;
    } else if (product.imageUrl) {
      updateData.imageUrl = product.imageUrl;
    }

    await db.collection('products').doc(id).update(updateData);
    
    // Fetch the updated product to return complete data
    const updatedDoc = await db.collection('products').doc(id).get();
    const updatedProduct = updatedDoc.data();
    
    res.status(200).json({ id, ...updatedProduct });
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
