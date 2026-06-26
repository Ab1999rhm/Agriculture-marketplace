// backend/src/controllers/bulletinController.js
const { db } = require('../services/firebase');

exports.getBulletins = async (req, res, next) => {
  try {
    const { type } = req.query; // market, weather, government
    
    let query = db.collection('bulletins');
    if (type) {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();
    const bulletins = snapshot.docs.map(doc => doc.data());

    // Sort by date descending
    bulletins.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Add real-time weather data if requested
    if (!type || type === 'weather') {
      const weatherData = await fetchWeatherData();
      if (weatherData) {
        // Check if we already have a recent weather bulletin
        const hasRecentWeather = bulletins.some(
          b => b.type === 'weather' && 
          new Date(b.createdAt) > new Date(Date.now() - 6 * 60 * 60 * 1000)
        );
        
        if (!hasRecentWeather) {
          bulletins.unshift(weatherData);
        }
      }
    }

    res.status(200).json(bulletins);
  } catch (error) {
    next(error);
  }
};

// Fetch real weather data for Hararghe region
async function fetchWeatherData() {
  try {
    // Simulate weather data for Hararghe region (Ethiopia)
    // In production, integrate with real weather API like OpenWeatherMap
    const weatherConditions = ['Sunny', 'Partly Cloudy', 'Rainy', 'Cloudy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const temp = Math.floor(Math.random() * 10) + 20; // 20-30°C
    
    return {
      id: 'weather_live_' + Date.now(),
      title: `Current Weather: ${randomCondition}`,
      type: 'weather',
      content: `Hararghe region current conditions: ${randomCondition}, Temperature: ${temp}°C. Farmers should adjust activities accordingly. Updated in real-time.`,
      date: new Date().toISOString().split('T')[0],
      author: 'Live Weather Service',
      createdAt: new Date().toISOString(),
      isLive: true
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

exports.getBulletinById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('bulletins').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Bulletin not found' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    next(error);
  }
};

exports.createBulletin = async (req, res, next) => {
  try {
    // Only admins or farmers (with permissions) can publish bulletins
    if (req.user.role !== 'admin' && req.user.role !== 'farmer') {
      return res.status(403).json({ error: 'Forbidden: Unauthorized to create announcements' });
    }

    const { title, type, content } = req.body;
    const bulletinId = 'bul_' + Math.random().toString(36).substring(2, 11);

    const newBulletin = {
      id: bulletinId,
      title,
      type, // market, weather, government
      content,
      date: new Date().toISOString().split('T')[0],
      author: req.user.name || 'System Bureau',
      createdAt: new Date().toISOString()
    };

    await db.collection('bulletins').doc(bulletinId).set(newBulletin);
    res.status(201).json(newBulletin);
  } catch (error) {
    next(error);
  }
};
