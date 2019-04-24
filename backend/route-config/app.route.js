module.exports = (app)=>{
    const ctrl = require('../controller/UserController');
    const fli = require('../controller/FlightsController');

    app.get('/', (req,res)=>res.send("Welcome to the Travel Mania"));
    app.post('/createUser', ctrl.createUser);
    app.get('/getUser/:email/:password', ctrl.getUser);

    app.post('/createFlights',fli.createFlights);
    app.get('/flights/:source/:destination',fli.getflights);

    app.post('/pay/:email', ctrl.startPayment);
    app.get('/executePayment', ctrl.executePayment);
    app.get('/cancel', ctrl.cancel);
}