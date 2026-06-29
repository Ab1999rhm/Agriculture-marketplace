// backend/scripts/removeTestFarmers.js
// Script to remove test farmers and their products from database
const { db, isMock } = require('../src/services/firebase');

async function removeTestFarmers() {
  try {
    console.log('Removing test farmers and their products...\n');
    
    const testFarmerIds = ['farmer1', 'farmer2']; // Kenenisa Jila and Fadila Ahmed
    
    for (const farmerId of testFarmerIds) {
      console.log(`Processing farmer ID: ${farmerId}`);
      
      // Remove user account
      await db.collection('users').doc(farmerId).delete();
      console.log(`  ✓ Removed user account`);
      
      // Remove farmer profile
      await db.collection('farmers').doc(farmerId).delete();
      console.log(`  ✓ Removed farmer profile`);
      
      // Remove products belonging to this farmer
      const productsSnapshot = await db.collection('products').where('farmerId', '==', farmerId).get();
      if (isMock) {
        const products = productsSnapshot.docs.map(doc => doc.data());
        for (const product of products) {
          await db.collection('products').doc(product.id).delete();
          console.log(`  ✓ Removed product: ${product.name}`);
        }
      } else {
        for (const doc of productsSnapshot.docs) {
          await db.collection('products').doc(doc.id).delete();
          console.log(`  ✓ Removed product: ${doc.data().name}`);
        }
      }
      
      // Remove bulk discounts belonging to this farmer
      const discountsSnapshot = await db.collection('bulkDiscounts').where('farmerId', '==', farmerId).get();
      if (isMock) {
        const discounts = discountsSnapshot.docs.map(doc => doc.data());
        for (const discount of discounts) {
          await db.collection('bulkDiscounts').doc(discount.id).delete();
          console.log(`  ✓ Removed bulk discount`);
        }
      } else {
        for (const doc of discountsSnapshot.docs) {
          await db.collection('bulkDiscounts').doc(doc.id).delete();
          console.log(`  ✓ Removed bulk discount`);
        }
      }
      
      // Remove auctions belonging to this farmer
      const auctionsSnapshot = await db.collection('auctions').where('farmerId', '==', farmerId).get();
      if (isMock) {
        const auctions = auctionsSnapshot.docs.map(doc => doc.data());
        for (const auction of auctions) {
          await db.collection('auctions').doc(auction.id).delete();
          console.log(`  ✓ Removed auction`);
        }
      } else {
        for (const doc of auctionsSnapshot.docs) {
          await db.collection('auctions').doc(doc.id).delete();
          console.log(`  ✓ Removed auction`);
        }
      }
      
      // Remove contracts belonging to this farmer
      const contractsSnapshot = await db.collection('contracts').where('farmerId', '==', farmerId).get();
      if (isMock) {
        const contracts = contractsSnapshot.docs.map(doc => doc.data());
        for (const contract of contracts) {
          await db.collection('contracts').doc(contract.id).delete();
          console.log(`  ✓ Removed contract`);
        }
      } else {
        for (const doc of contractsSnapshot.docs) {
          await db.collection('contracts').doc(doc.id).delete();
          console.log(`  ✓ Removed contract`);
        }
      }
      
      // Remove pre-harvest sales belonging to this farmer
      const preHarvestSnapshot = await db.collection('preHarvestSales').where('farmerId', '==', farmerId).get();
      if (isMock) {
        const preHarvest = preHarvestSnapshot.docs.map(doc => doc.data());
        for (const sale of preHarvest) {
          await db.collection('preHarvestSales').doc(sale.id).delete();
          console.log(`  ✓ Removed pre-harvest sale`);
        }
      } else {
        for (const doc of preHarvestSnapshot.docs) {
          await db.collection('preHarvestSales').doc(doc.id).delete();
          console.log(`  ✓ Removed pre-harvest sale`);
        }
      }
      
      console.log(`\n`);
    }
    
    console.log('✓ Test farmers and all their data removed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error removing test farmers:', error);
    process.exit(1);
  }
}

removeTestFarmers();
