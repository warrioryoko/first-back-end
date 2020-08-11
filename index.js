require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geoData = require('./data/geo.js');
const weatherData = require('./data/weather.js');
const { request } = require('https');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

const {
    GEOCODE_API_KEY,
    WEATHER_API_KEY
} = process.env;

async function getLatLong(cityName) {
    const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`);

    const city = response.body[0];

    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
    };
}

app.get('/location', async(req, res) => {
    try {
        const locationInput = req.query.search;
    
        const mungedData = await getLatLong(locationInput);
        res.json(mungedData);

    } catch(e) {
        res.status(500).json({ error: e.message });
    }

    // res.json({
    //     formatted_query: 'Seattle, WA USA',
    //     latitude: '47.606210',
    //     longitude: '-122.332071'
    // });
});

async function getWeather(lat,lon) {
    // TODO: we make an api call to get the weather
    const response = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat={locationLat}&lon={locationLon}&key={WEATHER_API_KEY}`);

    // const data = weatherData.data;
    const weather = response.body;

    const forecastArray = weather.map((weatherItem) => {
        return {
            forecast: weatherItem.weather.description,
            time: new Date(weatherItem.ts * 1000)
        };
    });

    return forecastArray;
}

app.get('/weather', (req, res) => {
    try {
        const locationLat = req.query.latitude;
        const locationLon = req.query.longitude;

        const mungedData = await getWeather(locationLat, locationLon);
        res.json(mungedData);
    } catch(e) {
        res.status(500).json({ error: e.message});
    }

});



app.get('/', (req, res) => {
    res.send('Hello World!');
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