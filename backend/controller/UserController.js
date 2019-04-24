const User = require('../model/SignUp');
const SignUp = require('../model/SignUp');
const paypal = require('paypal-rest-sdk');
const EmailValidator = require('email-validator');
const PasswordValidator = require('password-validator');
let price;
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Af_PNFloD8uH-l9eKKhH2nbvEUB0qZi1mEEuFAJ5E_zDkedPJu-QN_mi02rOA1aNAtv07GLuMTbIbVOd',
    'client_secret': 'EGCvZHCMNXajd-e72eGoDnzWNbKOF5Fc1D0-nP15sZuy-nGKt5NVlhHWGVfBRn__x3udeZlF-2jRRGGq'
});

exports.createUser = (req,res)=>{
    const schema = new PasswordValidator();
    schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().not().spaces()
    .has().symbols()
    .has().digits()

    if(EmailValidator.validate(req.body.email) && schema.validate(req.body.password)){
        const userObj = new SignUp({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
    
        userObj.save()
        .then(()=>res.status(200).json({"message":"New user record created successfully"}))
        .catch(()=>{
            res.status(400).json({"message":"Bad Request: email and password are required"});
        });
    }else
        res.status(400).json({"message":"Bad Request"});
}

exports.getUser = (req,res)=>{ 
    User.findOne({email: req.params.email}, (err, data) => {
        if(err || !data) res.status(400).json({"message":"Invalid EmailId/Password"});

        else if(data.password !== req.params.password) res.status(401).json({"message":"Invalid Password"});

        else res.status(200).json({"user": data});
    });
}

exports.startPayment = (req,res)=>{
    const bookingObj = {
        source: req.body.source,
        destination: req.body.destination,
        date: req.body.date,
        price: req.body.price,
        passengers: req.body.passengers,
        eventName: req.body.eventName
    }  
    price = req.body.price;
    User.updateOne({email: req.params.email}, { $push: { bookings: bookingObj }}, 
        (err, data) => {
            if(!err){
                const create_payment_json = {
                    "intent": "sale",
                    "payer": { 
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:4200/executePayment",
                        "cancel_url": "http://localhost:3000/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": req.body.source,
                                "sku": req.body.destination,
                                "price": req.body.price,
                                "currency": "USD",
                                "quantity": req.body.passengers
                            }]
                        },
                        "amount": {
                            "currency": "USD",
                            "total": (Number(req.body.price)* Number(req.body.passengers)).toString()
                        },
                        "description": "Flight ticket booking"
                    }]
                };
            
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        res.status(400).json({message: 'Error while performing payment'});
                    } else {
                        for(let i=0;i< payment.links.length;i++){
                            if(payment.links[i].rel === 'approval_url') {
                                res.status(200).json({url :payment.links[i].href});
                            }
                        }
                    }
                });
            } 
            else res.status(400).json({"message": "Error while pushing user data"});
    });
}

exports.executePayment = (req,res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": price
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            res.status(400).json({'message':'error'});
        } else {
            console.log(JSON.stringify(payment));
            res.status(200).json({'message':'Payment Successful'});
        }
    });
};

exports.cancel = (req, res) => res.send('Cancelled');