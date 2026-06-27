// backend/src/controllers/adminController.js
const { db, isMock } = require('../services/firebase');

exports.getAllUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => {
      const user = doc.data();
      delete user.passwordHash;
      return user;
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).update({
      approved: true,
      approvedAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    next(error);
  }
};

exports.suspendUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).update({
      suspended: true,
      suspendedAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'User suspended successfully' });
  } catch (error) {
    next(error);
  }
};

exports.rejectUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).update({
      approved: false,
      rejected: true,
      rejectedAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    next(error);
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).update({
      suspended: false,
      activatedAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    // Also delete from role-specific collections
    const userDoc = await db.collection('users').doc(id).get();
    if (userDoc.exists) {
      const role = userDoc.data().role;
      if (role === 'farmer') {
        await db.collection('farmers').doc(id).delete();
      } else if (role === 'buyer') {
        await db.collection('buyers').doc(id).delete();
      }
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    // Get total users by role
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    
    const farmers = users.filter(u => u.role === 'farmer').length;
    const buyers = users.filter(u => u.role === 'buyer').length;
    const admins = users.filter(u => u.role === 'admin').length;

    // Get total products
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => doc.data());
    const totalProducts = products.length;
    const crops = products.filter(p => p.category === 'Crops').length;
    const livestock = products.filter(p => p.category === 'Livestock').length;

    // Get total orders
    const ordersSnapshot = await db.collection('orders').get();
    const orders = ordersSnapshot.docs.map(doc => doc.data());
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalPrice : 0), 0);

    // Get recent activity
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({
      users: { total: users.length, farmers, buyers, admins },
      products: { total: totalProducts, crops, livestock },
      orders: { total: totalOrders, paid: paidOrders, revenue: totalRevenue },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

exports.getDisputes = async (req, res, next) => {
  try {
    // Mock disputes - in real app, this would be a separate collection
    const disputesSnapshot = await db.collection('disputes').get();
    const disputes = disputesSnapshot.docs.map(doc => doc.data());
    res.status(200).json(disputes);
  } catch (error) {
    next(error);
  }
};

exports.resolveDispute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    await db.collection('disputes').doc(id).update({
      status: 'resolved',
      resolution,
      resolvedAt: new Date().toISOString(),
      resolvedBy: req.user.id
    });
    res.status(200).json({ message: 'Dispute resolved successfully' });
  } catch (error) {
    next(error);
  }
};

exports.createBulletin = async (req, res, next) => {
  try {
    const { title, content, type } = req.body;
    const bulletinId = 'bulletin_' + Date.now();
    await db.collection('bulletins').doc(bulletinId).set({
      id: bulletinId,
      title,
      content,
      type: type || 'general',
      author: req.user.name,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ message: 'Bulletin created successfully', id: bulletinId });
  } catch (error) {
    next(error);
  }
};

exports.updateBulletin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, type } = req.body;
    await db.collection('bulletins').doc(id).update({
      title,
      content,
      type,
      updatedAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'Bulletin updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteBulletin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('bulletins').doc(id).delete();
    res.status(200).json({ message: 'Bulletin deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getSystemHealth = async (req, res, next) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: isMock ? 'mock' : 'firebase',
      uptime: process.uptime()
    };
    res.status(200).json(health);
  } catch (error) {
    next(error);
  }
};

exports.createBackup = async (req, res, next) => {
  try {
    // Mock backup - in real app, this would create actual backups
    res.status(200).json({ 
      message: 'Backup created successfully',
      backupId: 'backup_' + Date.now(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => doc.data());
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.hideProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).update({
      hidden: true,
      hiddenAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'Product hidden successfully' });
  } catch (error) {
    next(error);
  }
};

exports.showProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).update({
      hidden: false,
      shownAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'Product shown successfully' });
  } catch (error) {
    next(error);
  }
};

exports.expireProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).update({
      expired: true,
      expiredAt: new Date().toISOString()
    });
    res.status(200).json({ message: 'Product expired successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
