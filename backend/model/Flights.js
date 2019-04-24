const mongoose = require('mongoose');

const Flights = mongoose.Schema({
    source: String,
    destination: String,
    time: String,
    flightname: String,
});

module.exports = mongoose.model('flights', Flights);