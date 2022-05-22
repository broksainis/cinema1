const { XMLParser } = require('fast-xml-parser');
const request = require('request');

const PARSER_OPTIONS = {
    ignoreAttributes: false
};

const getCurrentMoviesList = async (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, res, body) => {
            if (!error && res.statusCode == 200) {
                const parser = new XMLParser(PARSER_OPTIONS);
                const jsonContent = parser.parse(body);
                const events = jsonContent.Events.Event;
                resolve(events);
            } else {
                reject(error);
            }
        });
    })
};

const getCurrentSchedule = async (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, res, body) => {
            if (!error && res.statusCode == 200) {
                const parser = new XMLParser(PARSER_OPTIONS);
                const jsonContent = parser.parse(body);
                const shows = jsonContent.Schedule.Shows.Show;
                resolve(shows);
            } else {
                reject(error);
            }
        });
    })
};

const mergeMoviesWithSchedule = async (moviesUrl, scheduleUrl) => {
    const movies = await getCurrentMoviesList(moviesUrl);
    const schedule = await getCurrentSchedule(scheduleUrl);
    movies.forEach(movie => {
        movie.Events = [];
        if (schedule) {
            schedule.forEach(event => {
                if (event.OriginalTitle === movie.OriginalTitle) {
                    movie.Events.push(event);
                }
            })
        }
    });
    return movies;
};

module.exports = {
    mergeMoviesWithSchedule
}