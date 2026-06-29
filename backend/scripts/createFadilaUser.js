// backend/scripts/createFadilaUser.js
// Script to create user account for Fadila Ahmed
const bcrypt = require('bcryptjs');
const { db, isMock } = require('../src/services/firebase');

async function createFadilaUser() {
  try {
    console.log('Creating user account for Fadila Ahmed...\n');
    
    const email = 'fadila@hararghe.com';
    const password = 'demo123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const userId = 'farmer2'; // Matches the farmer ID in the database
    
    const userProfile = {
      id: userId,
      email,
      name: 'Fadila Ahmed',
      role: 'farmer',
      phone: '0912345678',
      location: 'Babille',
      farmName: 'Babille Farms',
      farmSize: '5 hectares',
      crops: 'Groundnuts, Mangoes, Onions',
      createdAt: new Date().toISOString(),
      passwordHash
    };
    
    if (isMock) {
      // Mock mode: write to db.json
      await db.collection('users').doc(userId).set(userProfile);
      console.log('✓ User account created successfully in mock database');
    } else {
      // Real Firebase
      await db.collection('users').doc(userId).set(userProfile);
      console.log('✓ User account created successfully in Firestore');
    }
    
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User ID: ${userId}`);
    console.log('========================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createFadilaUser();
