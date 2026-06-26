// backend/src/seedBulletins.js
// Script to seed Firestore with sample bulletin data
const { db } = require('./services/firebase');

const sampleBulletins = [
  {
    id: 'bul_weather_001',
    title: 'Heavy Rainfall Alert for Hararghe Region',
    type: 'weather',
    content: 'Meteorological services predict heavy rainfall in the Hararghe region over the next 72 hours. Farmers are advised to secure harvested crops and ensure proper drainage in coffee plantations. Expected rainfall: 80-120mm.',
    date: new Date().toISOString().split('T')[0],
    author: 'Ethiopian Meteorological Agency',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bul_market_001',
    title: 'Coffee Price Surge: Harar Grade A Reaches Record High',
    type: 'market',
    content: 'Local market rates show significant increase in Harar coffee prices. Grade A coffee now trading at $4.85/kg, up 15% from last month. Farmers are encouraged to sell through certified cooperatives for better rates.',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    author: 'Hararghe Agricultural Bureau',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'bul_gov_001',
    title: 'Fertilizer Distribution Schedule Announced',
    type: 'government',
    content: 'The government has announced the fertilizer distribution schedule for the upcoming planting season. DAP and UREA fertilizers will be available at cooperative centers starting next week. Farmers should register with local agricultural offices to receive allocations.',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    author: 'Ministry of Agriculture',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'bul_weather_002',
    title: 'Drought Warning: Eastern Zones',
    type: 'weather',
    content: 'Eastern zones of Hararghe are experiencing below-average rainfall. Farmers in these areas are advised to implement water conservation measures and consider drought-resistant crop varieties for the next planting season.',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    author: 'Regional Disaster Prevention',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'bul_market_002',
    title: 'Cereal Market Update: Wheat and Barley Prices Stable',
    type: 'market',
    content: 'Cereal market analysis shows stable prices for wheat and barley across the region. Current market rates: Wheat - $0.45/kg, Barley - $0.38/kg. Good harvest expected from highland areas.',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    author: 'Market Analysis Bureau',
    createdAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 'bul_gov_002',
    title: 'Agricultural Loan Program Extended',
    type: 'government',
    content: 'The agricultural loan program has been extended with additional funding. Smallholder farmers can now access low-interest loans for equipment purchase and farm improvement. Contact local agricultural offices for application details.',
    date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
    author: 'Development Bank of Ethiopia',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
];

async function seedBulletins() {
  try {
    console.log('Starting bulletin seed...');
    
    for (const bulletin of sampleBulletins) {
      await db.collection('bulletins').doc(bulletin.id).set(bulletin);
      console.log(`✓ Added bulletin: ${bulletin.title}`);
    }
    
    console.log('✓ Bulletins seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bulletins:', error);
    process.exit(1);
  }
}

seedBulletins();
