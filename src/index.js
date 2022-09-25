const express = require("express");
const routes = require("./routes");
const postRoutes = require("./models/Post/routes");
const mongo = require("./database/mongo");
const helmet = require("helmet");
const fs = require("fs");
const https = require("https");
const { request } = require("http");
const auth = require('./auth/auth');
const expressRateLimit = require('express-rate-limit');

// Connect to MongoDB database
mongo.getDatabase().then(() => {
    // Setup app
    const app = express();
    app.use(helmet());

    // Middleware
    app.use((req, res, next) => {
        if(!req.query.key){
            return res.status(500).send('Unauthorized');
        } else {
            if(auth.isAuthorized(req)) {
                return next();
            }
        }
        return res.status(500).send('Unauthorized');
    });

    // Rate limiter middleware
    const limiter = expressRateLimit.rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: "Unauthorized",
        statusCode: 500
    });
    app.use(limiter);

    // Add routes
    app.use("/api", routes);
    app.use("/api", postRoutes);

    // custom 404
    app.use((req, res, next) => {
        res.status(404).send("Sorry can't find that!")
    })

    // custom error handler
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })

    // Helmet options
    app.use(helmet.hidePoweredBy({ setTo: 'Drupal 5.7.0' }));
    app.use(helmet.xssFilter());

    // Enforce TLS
    app.use((req, res, next) => {
        if (!request.secure) {
            console.log("Rerouting request to secure connection")
            return response.redirect("https://" + request.headers.host + request.url);
        }
        next();
    });

    https.createServer({
        cert: fs.readFileSync('../cert/server.crt'),
        key: fs.readFileSync('../cert/ca.pem')
    }, app).listen(9443);
})