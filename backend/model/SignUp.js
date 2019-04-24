const mongoose = require('mongoose');

const SignUp = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    bookings:[
        {
            source: String,
            destination: String,
            date: String,
            price: String,
            passengers: String,
            eventName: String
        }
    ]
});

module.exports = mongoose.model('SignUp', SignUp);