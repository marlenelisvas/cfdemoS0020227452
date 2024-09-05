const express = require("express");

const passport = require("passport");
const xsenv = require("@sap/xsenv");

const httpClient = require("@sap-cloud-sdk/http-client");
const {retrieveJwt} = require("@sap-cloud-sdk/connectivity");

const JWTStrategy = require("@sap/xssec").JWTStrategy;
//const services = xsenv.getServices({uaa: "cfdemoS0020227452-xsuaa"}); //xsuaa service
const services = xsenv.getServices({uaa: "cfdemoS0020227452-xsuaa"},{dest:{label: 'destination'}}); //xsuaa service & Destination

const app = express();

passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT",{session: false}));


/*app.get("/", function(req, res, next){
    res.send("Welcome to Basic NodeJs");
});*/

app.get("/", function(req, res, next){
    res.send("Welcome to Basic NodeJs "+ req.user.id);
});

app.get("/user", function(req, res, next){
    res.send("I am  "+ req.user.id);
});

//destination reuse service
// /srv/destinations?destinationX=northwind&path=Regions

app.get('/destinations', async function(req, res){
    try{
        let res1 = await httpClient.executeHttpRequest(
           {
            destinationName: req.query.destinationX || '',
            jwt: retrieveJwt(req)
           },
           {
                method:'GET',
                url: req.query.path || '/'
           }
        );
        res.status(200).send(res1.data);
    }
    catch(error){
        res.status(500).send(error.message);
    }
});
const port = process.env.PORT || 5000;
app.listen(port, function(){console.log("Basic NodeJS listening on port " + port);});