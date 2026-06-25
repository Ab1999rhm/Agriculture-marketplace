// backend/src/services/featureFlags.js
require('dotenv').config();

module.exports = {
  ENABLE_CBE_BIRR: process.env.ENABLE_CBE_BIRR !== 'false', // Defaults to true
  ENABLE_TELEBIRR: process.env.ENABLE_TELEBIRR === 'true', // Defaults to false
};
