// backend/src/services/firebase.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let db;
let isMock = false;

const hasFirebaseConfig = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (hasFirebaseConfig) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
    db = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin, falling back to mock database:', error.message);
    isMock = true;
  }
} else {
  console.log('No Firebase credentials found in environment. Initializing local JSON mock database.');
  isMock = true;
}

if (isMock) {
  // Simple JSON file DB for local testing
  const DB_FILE = path.join(__dirname, '../../db.json');

  const readDb = () => {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({
        farmers: [
          {
            id: 'farmer1',
            name: 'Kenenisa Jila',
            phone: '0911223344',
            location: 'Alem Maya',
            coordinates: '9.3900, 42.0800',
            crops: ['Coffee', 'Chat', 'Maize'],
            bio: 'Experienced organic coffee farmer from Hararghe highlands.'
          },
          {
            id: 'farmer2',
            name: 'Fadila Ahmed',
            phone: '0912345678',
            location: 'Babille',
            coordinates: '9.2100, 42.2500',
            crops: ['Groundnuts', 'Mangoes', 'Onions'],
            bio: 'Specializing in Babille groundnuts and orchard fruits.'
          }
        ],
        products: [
          {
            id: 'prod1',
            farmerId: 'farmer1',
            farmerName: 'Kenenisa Jila',
            name: 'Harar Organic Coffee',
            category: 'Crops',
            type: 'Coffee',
            price: 350,
            quantity: 500,
            unit: 'kg',
            harvestDate: '2026-06-15',
            location: 'Alem Maya',
            description: 'Premium Harar Grade 1 green coffee beans, naturally sun-dried.'
          },
          {
            id: 'prod2',
            farmerId: 'farmer2',
            farmerName: 'Fadila Ahmed',
            name: 'Babille Groundnuts',
            category: 'Crops',
            type: 'Groundnuts',
            price: 120,
            quantity: 1000,
            unit: 'kg',
            harvestDate: '2026-06-10',
            location: 'Babille',
            description: 'Sweet, shelled red peanuts, high quality crop.'
          },
          {
            id: 'prod3',
            farmerId: 'farmer1',
            farmerName: 'Kenenisa Jila',
            name: 'Hararghe Bull',
            category: 'Livestock',
            type: 'Bull',
            price: 45000,
            quantity: 2,
            unit: 'head',
            harvestDate: '2026-06-20',
            location: 'Alem Maya',
            description: 'Fat, well-fed local breed bull, ready for market.'
          }
        ],
        orders: [],
        users: [
          {
            id: 'user1',
            email: 'farmer@hararghe.com',
            passwordHash: '$2a$10$X7m6ZskFz8t5sC9B6E0M.O81g4v9mD.2r5g4v9mD.2r5g4v9mD.', // demo123
            name: 'Kenenisa Jila',
            role: 'farmer',
            phone: '0911223344',
            location: 'Alem Maya',
            approved: true
          },
          {
            id: 'user2',
            email: 'buyer@hararghe.com',
            passwordHash: '$2a$10$X7m6ZskFz8t5sC9B6E0M.O81g4v9mD.2r5g4v9mD.2r5g4v9mD.', // demo123
            name: 'Abdi Yusuf',
            role: 'buyer',
            phone: '0922334455',
            location: 'Harar City'
          }
        ],
        bulletins: [
          {
            id: 'b1',
            title: 'Market Update: Coffee prices up by 5%',
            type: 'market',
            content: 'Coffee (Harar Grade 1) has seen an increase of 5% in the local auction market this week.',
            date: '2026-06-24',
            author: 'Ministry of Agriculture'
          },
          {
            id: 'b2',
            title: 'Weather Warning: Heavy rainfall expected in Harar region',
            type: 'weather',
            content: 'Farmers are advised to take necessary precautions as heavy rains are expected over the next three days.',
            date: '2026-06-23',
            author: 'Meteorology Agency'
          },
          {
            id: 'b3',
            title: 'Government Subsidized Fertilizer Distribution',
            type: 'government',
            content: 'Fertilizer distribution has started at local cooperatives. Please bring your farmer ID.',
            date: '2026-06-22',
            author: 'Agricultural Bureau'
          }
        ]
      }, null, 2));
    }
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
      return {};
    }
  };

  const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  };

  class MockDoc {
    constructor(collectionName, docId) {
      this.collectionName = collectionName;
      this.docId = docId;
    }
    async get() {
      const data = readDb();
      const items = data[this.collectionName] || [];
      const item = items.find(i => i.id === this.docId);
      return {
        exists: !!item,
        id: this.docId,
        data: () => item ? { ...item } : null
      };
    }
    async set(value) {
      const data = readDb();
      if (!data[this.collectionName]) data[this.collectionName] = [];
      const index = data[this.collectionName].findIndex(i => i.id === this.docId);
      const docData = { id: this.docId, ...value };
      if (index >= 0) {
        data[this.collectionName][index] = docData;
      } else {
        data[this.collectionName].push(docData);
      }
      writeDb(data);
      return docData;
    }
    async update(value) {
      const data = readDb();
      if (!data[this.collectionName]) return;
      const index = data[this.collectionName].findIndex(i => i.id === this.docId);
      if (index >= 0) {
        data[this.collectionName][index] = { ...data[this.collectionName][index], ...value };
        writeDb(data);
        return data[this.collectionName][index];
      }
    }
    async delete() {
      const data = readDb();
      if (!data[this.collectionName]) return;
      data[this.collectionName] = data[this.collectionName].filter(i => i.id !== this.docId);
      writeDb(data);
    }
  }

  class MockQuery {
    constructor(collectionName, filters = [], sort = null, limitVal = null) {
      this.collectionName = collectionName;
      this.filters = filters;
      this.sort = sort;
      this.limitVal = limitVal;
    }
    where(field, op, val) {
      return new MockQuery(
        this.collectionName,
        [...this.filters, { field, op, val }],
        this.sort,
        this.limitVal
      );
    }
    orderBy(field, dir = 'asc') {
      return new MockQuery(
        this.collectionName,
        this.filters,
        { field, dir },
        this.limitVal
      );
    }
    limit(num) {
      return new MockQuery(
        this.collectionName,
        this.filters,
        this.sort,
        num
      );
    }
    async get() {
      const data = readDb();
      let items = data[this.collectionName] || [];
      
      // Apply filters
      for (const f of this.filters) {
        items = items.filter(item => {
          const itemVal = item[f.field];
          if (f.op === '==') return itemVal === f.val;
          if (f.op === '>=') return itemVal >= f.val;
          if (f.op === '<=') return itemVal <= f.val;
          if (f.op === '>') return itemVal > f.val;
          if (f.op === '<') return itemVal < f.val;
          if (f.op === 'array-contains') return Array.isArray(itemVal) && itemVal.includes(f.val);
          return true;
        });
      }
      
      // Apply sorting
      if (this.sort) {
        const { field, dir } = this.sort;
        items.sort((a, b) => {
          if (a[field] < b[field]) return dir === 'desc' ? 1 : -1;
          if (a[field] > b[field]) return dir === 'desc' ? -1 : 1;
          return 0;
        });
      }
      
      // Apply limit
      if (this.limitVal !== null) {
        items = items.slice(0, this.limitVal);
      }
      
      return {
        docs: items.map(item => ({
          id: item.id,
          exists: true,
          data: () => ({ ...item })
        }))
      };
    }
  }

  class MockCollection extends MockQuery {
    doc(id) {
      const docId = id || Math.random().toString(36).substring(2, 15);
      return new MockDoc(this.collectionName, docId);
    }
    async add(value) {
      const docId = Math.random().toString(36).substring(2, 15);
      const docRef = this.doc(docId);
      await docRef.set(value);
      return docRef;
    }
  }

  class MockFirestore {
    collection(name) {
      return new MockCollection(name);
    }
  }

  db = new MockFirestore();
}

module.exports = { admin, db, isMock };
