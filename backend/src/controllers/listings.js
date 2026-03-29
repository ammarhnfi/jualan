const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { notifyNearbyUsers } = require('../services/notifications');

// Create a new listing
router.post('/', async (req, res) => {
  const { title, description, category_id, price, contact, latitude, longitude, device_id } = req.body;

  if (!title || !contact || !latitude || !longitude || !device_id) {
    return res.status(400).json({ error: 'Missing required fields or device_id' });
  }

  try {
    // Check Rate Limiting (Spam protection)
    const rateCheck = await pool.query(
      `SELECT COUNT(*) FROM listings WHERE device_id = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
      [device_id]
    );
    
    if (parseInt(rateCheck.rows[0].count) >= 10) {
      return res.status(429).json({ error: 'Batas maksimal 10 posting jualan per jam telah tercapai. Silakan coba lagi nanti.' });
    }

    const result = await pool.query(
      `INSERT INTO listings (title, description, category_id, price, contact, location, device_id)
       VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8)
       RETURNING id, title, ST_AsGeoJSON(location) as location`,
      [title, description, category_id, price, contact, longitude, latitude, device_id]
    );

    const newListing = result.rows[0];

    // Trigger notification
    await notifyNearbyUsers(newListing);

    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get listings within a radius
router.get('/', async (req, res) => {
  const { latitude, longitude, radius_km = 1 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // PostGIS ST_DWithin uses meters when cast to geography, or degrees for geometry
    // To cleanly use meters we cast geometry to geography
    const result = await pool.query(
      `SELECT id, title, description, category_id, price, contact, created_at,
              ST_Y(location::geometry) as latitude,
              ST_X(location::geometry) as longitude,
              ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters
       FROM listings
       WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
       ORDER BY distance_meters ASC
       LIMIT 100`,
      [longitude, latitude, radius_km * 1000]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
