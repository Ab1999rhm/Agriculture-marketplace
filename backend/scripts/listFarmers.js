// backend/scripts/listFarmers.js
// Script to list all farmers with their credentials (for developer use only)
const { db, isMock } = require('../src/services/firebase');

async function listFarmers() {
  try {
    console.log('Fetching all farmers from database...\n');
    
    let users;
    
    if (isMock) {
      // Mock mode: fetch all users and filter manually
      const allUsersSnapshot = await db.collection('users').get();
      users = allUsersSnapshot.docs.map(doc => doc.data()).filter(u => u.role === 'farmer');
    } else {
      // Real Firebase: use where clause
      const usersSnapshot = await db.collection('users').where('role', '==', 'farmer').get();
      users = usersSnapshot.docs.map(doc => doc.data());
    }
    
    if (users.length === 0) {
      console.log('No farmers found in database.');
      process.exit(0);
    }
    
    console.log('=== FARMERS LIST ===\n');
    
    users.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`User ID: ${user.id}`);
      console.log(`Phone: ${user.phone}`);
      console.log(`Location: ${user.location}`);
      console.log(`Farm Name: ${user.farmName || 'N/A'}`);
      console.log(`Farm Size: ${user.farmSize || 'N/A'}`);
      console.log(`Crops: ${user.crops || 'N/A'}`);
      console.log(`Created At: ${user.createdAt}`);
      console.log('------------------------\n');
    });
    
    console.log(`Total farmers: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error listing farmers:', error);
    process.exit(1);
  }
}

listFarmers();
