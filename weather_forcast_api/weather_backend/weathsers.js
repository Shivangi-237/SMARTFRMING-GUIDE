// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.WEATHER_API_KEY;

// Route for current weather by coordinates
app.get('/weather', async (req, res) => {
    const { lat, lon, lang = 'en' } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Weather data fetch failed', detail: error.message });
    }
});

// Route to fetch coordinates from city name
app.get('/geocode', async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const response = await axios.get(geoURL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Geocoding failed', detail: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
