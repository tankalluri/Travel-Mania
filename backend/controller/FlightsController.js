const Flights = require('../model/Flights');

exports.createFlights = (req,res) => {
    const flights = new Flights({
        source : req.body.source,
        destination : req.body.destination,
        time : req.body.time,
        flightname : req.body.flightname
    });

    flights.save().
    then(() => {
        res.send({'message':'Flights saved successfully'});
    });
};

exports.getflights = (req,res) => {
    // const data = {
    //     source: req.params.source,
    //     destination: req.params.destination
    // };
    // Flights.find((data,(error,flights) => {
    //     if(!flights || error){
    //         res.status(401).send({'message':'flights with source destination not allowed'});
    //     }else{
    //         res.send({'flights':flights});
    //     }
    // }))

    Flights.find({"source": req.params.source,
                "destination":req.params.destination}, function(err,result){
                   if (err)
                   {
                        res.send(err);
                        console.log(err);
                     
                   }
                   else{
                       res.send(result);
                       console.log(result);
                   }



                })
           
}

