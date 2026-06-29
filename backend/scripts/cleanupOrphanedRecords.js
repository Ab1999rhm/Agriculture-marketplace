// Script to clean up orphaned records in Firestore
// Run with: node scripts/cleanupOrphanedRecords.js

const { db } = require('../src/services/firebase');

async function cleanupOrphanedRecords() {
  console.log('Starting cleanup of orphaned records...\n');

  try {
    // 1. Clean up bulk discounts without farmerId or productId
    console.log('Checking bulk discounts...');
    const bulkDiscountsSnapshot = await db.collection('bulkDiscounts').get();
    let bulkDiscountsDeleted = 0;
    
    for (const doc of bulkDiscountsSnapshot.docs) {
      const data = doc.data();
      if (!data.farmerId || !data.productId) {
        console.log(`  Deleting orphaned bulk discount: ${doc.id} (missing ${!data.farmerId ? 'farmerId' : 'productId'})`);
        await doc.ref.delete();
        bulkDiscountsDeleted++;
      }
    }
    console.log(`  Bulk discounts cleaned: ${bulkDiscountsDeleted}\n`);

    // 2. Clean up auctions without farmerId or productId
    console.log('Checking auctions...');
    const auctionsSnapshot = await db.collection('auctions').get();
    let auctionsDeleted = 0;
    
    for (const doc of auctionsSnapshot.docs) {
      const data = doc.data();
      if (!data.farmerId || !data.productId) {
        console.log(`  Deleting orphaned auction: ${doc.id} (missing ${!data.farmerId ? 'farmerId' : 'productId'})`);
        await doc.ref.delete();
        auctionsDeleted++;
      }
    }
    console.log(`  Auctions cleaned: ${auctionsDeleted}\n`);

    // 3. Clean up contracts without farmerId or productId
    console.log('Checking contracts...');
    const contractsSnapshot = await db.collection('contracts').get();
    let contractsDeleted = 0;
    
    for (const doc of contractsSnapshot.docs) {
      const data = doc.data();
      if (!data.farmerId || !data.productId) {
        console.log(`  Deleting orphaned contract: ${doc.id} (missing ${!data.farmerId ? 'farmerId' : 'productId'})`);
        await doc.ref.delete();
        contractsDeleted++;
      }
    }
    console.log(`  Contracts cleaned: ${contractsDeleted}\n`);

    // 4. Clean up pre-harvest sales without farmerId or productId
    console.log('Checking pre-harvest sales...');
    const preHarvestSnapshot = await db.collection('preHarvestSales').get();
    let preHarvestDeleted = 0;
    
    for (const doc of preHarvestSnapshot.docs) {
      const data = doc.data();
      if (!data.farmerId || !data.productId) {
        console.log(`  Deleting orphaned pre-harvest sale: ${doc.id} (missing ${!data.farmerId ? 'farmerId' : 'productId'})`);
        await doc.ref.delete();
        preHarvestDeleted++;
      }
    }
    console.log(`  Pre-harvest sales cleaned: ${preHarvestDeleted}\n`);

    // 5. Clean up product references that don't exist
    console.log('Checking for references to non-existent products...');
    const productsSnapshot = await db.collection('products').get();
    const productIds = new Set(productsSnapshot.docs.map(doc => doc.id));
    console.log(`  Total products in database: ${productIds.size}`);
    
    let invalidBulkDiscounts = 0;
    let invalidAuctions = 0;
    let invalidContracts = 0;
    let invalidPreHarvest = 0;

    // Check bulk discounts
    for (const doc of bulkDiscountsSnapshot.docs) {
      const data = doc.data();
      if (data.productId && !productIds.has(data.productId)) {
        console.log(`  Deleting bulk discount with invalid productId: ${doc.id}`);
        await doc.ref.delete();
        invalidBulkDiscounts++;
      }
    }

    // Check auctions
    for (const doc of auctionsSnapshot.docs) {
      const data = doc.data();
      if (data.productId && !productIds.has(data.productId)) {
        console.log(`  Deleting auction with invalid productId: ${doc.id}`);
        await doc.ref.delete();
        invalidAuctions++;
      }
    }

    // Check contracts
    for (const doc of contractsSnapshot.docs) {
      const data = doc.data();
      if (data.productId && !productIds.has(data.productId)) {
        console.log(`  Deleting contract with invalid productId: ${doc.id}`);
        await doc.ref.delete();
        invalidContracts++;
      }
    }

    // Check pre-harvest sales
    for (const doc of preHarvestSnapshot.docs) {
      const data = doc.data();
      if (data.productId && !productIds.has(data.productId)) {
        console.log(`  Deleting pre-harvest sale with invalid productId: ${doc.id}`);
        await doc.ref.delete();
        invalidPreHarvest++;
      }
    }

    console.log(`  Invalid references cleaned:`);
    console.log(`    Bulk discounts: ${invalidBulkDiscounts}`);
    console.log(`    Auctions: ${invalidAuctions}`);
    console.log(`    Contracts: ${invalidContracts}`);
    console.log(`    Pre-harvest sales: ${invalidPreHarvest}\n`);

    // Summary
    const totalDeleted = bulkDiscountsDeleted + auctionsDeleted + contractsDeleted + preHarvestDeleted + 
                        invalidBulkDiscounts + invalidAuctions + invalidContracts + invalidPreHarvest;
    
    console.log('='.repeat(50));
    console.log('CLEANUP COMPLETE');
    console.log('='.repeat(50));
    console.log(`Total records deleted: ${totalDeleted}`);
    console.log(`  - Missing required fields: ${bulkDiscountsDeleted + auctionsDeleted + contractsDeleted + preHarvestDeleted}`);
    console.log(`  - Invalid product references: ${invalidBulkDiscounts + invalidAuctions + invalidContracts + invalidPreHarvest}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupOrphanedRecords()
  .then(() => {
    console.log('\nCleanup script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup script failed:', error);
    process.exit(1);
  });
