require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geoData = require('./data/geo.js');
const weatherData = require('./data/weather.js');
const app = express();

const PORT = process.env.PORT;

app.use(cors());

function getLatLong(cityName) {
    const city = geoData[0];

    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
    };
}

function getWeather(lat,lon) {
    // TODO: we make an api call to get the weather
    const data = weatherData.data;

    const forecastArray = data.map((weatherItem) => {
        return {
            forecast: weatherItem.weather.description,
            time: new Date(weatherItem.ts * 1000)
        };
    });

    return forecastArray;
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/location', (req, res) => {
    try {
        const locationInput = req.query.search;
    
        const mungedData = getLatLong(locationInput);
        res.json(mungedData);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }

    // res.json({
    //     formatted_query: 'Seattle, WA USA',
    //     latitude: '47.606210',
    //     longitude: '-122.332071'
    // });
});

app.get('/weather', (req, res) => {
    try {
        const locationLat = req.query.latitude;
        const locationLon = req.query.longitude;

        const mungedData = getWeather(locationLat, locationLon);
        res.json(mungedData);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }

});

// app.get('/SIMP/:id', (req, res) => {
//     // res.send('How do I qualify for government grants? S.I.M.P. SQUIRRELS In My Pants!');

//     // res.send(`Hello SIMP ${req.query.username}! Your password is: ${req.query.password}`);

//     // res.json({
//     //     name: req.query.username,
//     //     code: req.query.password
//     // })

//     res.send(req.params.id);
// });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});