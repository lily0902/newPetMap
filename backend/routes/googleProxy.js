const express = require('express');
const router = express.Router();
const axios = require('axios');
const authenticateToken = require('../middleware/authenticateToken');

// 代理 Google Places API
router.get('/proxy/place-details', authenticateToken, async (req, res) => {
  const { placeId, language } = req.query;
  if (!placeId) return res.status(400).json({ message: 'placeId required' });
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  try {
    const lang = language || 'zh-TW';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,photos,vicinity,international_phone_number,formatted_phone_number,opening_hours,current_opening_hours,rating,reviews&language=${lang}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Google API error', error: err.message, detail: err.response?.data });
  }
});

module.exports = router; 