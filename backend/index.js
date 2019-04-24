const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');

const dbConfig = require('./db-config/DatabaseConfig');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Af_PNFloD8uH-l9eKKhH2nbvEUB0qZi1mEEuFAJ5E_zDkedPJu-QN_mi02rOA1aNAtv07GLuMTbIbVOd',
    'client_secret': 'EGCvZHCMNXajd-e72eGoDnzWNbKOF5Fc1D0-nP15sZuy-nGKt5NVlhHWGVfBRn__x3udeZlF-2jRRGGq'
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(dbConfig.url, { useNewUrlParser: true }, ()=>{
}).then(()=> console.log("Database Connection Successful...")).catch(()=>console.log("Error while connecting to database.."));

require('./route-config/app.route')(app);

app.listen('3000', ()=>console.log("Server is listening on port 3000..."));
