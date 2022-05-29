const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config();
const utils = require('./utils.js');
const path = require('path');

// app constants
const APOLLO_KINO_EVENTS_URL = 'https://www.apollokino.lv/xml/Events?listType=NowInTheaters';
const APOLLO_KINO_SCHEDULE_URL = 'https://www.apollokino.lv/xml/Schedule/';

const title = 'Kino Monolith';

app.locals.dateFns = require('date-fns');
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

app.set('view engine', 'pug');
app.get("/", async (req, res) => {
    try {
        const movies = await utils.mergeMoviesWithSchedule(APOLLO_KINO_EVENTS_URL, APOLLO_KINO_SCHEDULE_URL);
        res.render('index', { title, movies });
    } catch (error) {
        console.error(error);
    }
});

app.get("/:ID", async (req, res) => {
    try {
        const movies = await utils.mergeMoviesWithSchedule(APOLLO_KINO_EVENTS_URL, APOLLO_KINO_SCHEDULE_URL);
        const movie = movies.find((movieData) => {
            return parseInt(movieData.ID) === parseInt(req.params.ID);
        });
        res.render('item', { title, movie });
    } catch (error) {
        console.error(error);
    }
});

app.listen(port, () => {
    console.log('Server started.');
})