const express = require("express");
const routes = require("./routes");
const postRoutes = require("./models/Post/routes");
const mongo = require("./database/mongo");
const helmet = require("helmet");

// Connect to MongoDB database
mongo.getDatabase().then(() => {
    // Setup app
    const app = express();
    app.use(helmet());

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

    // Start listener
    app.listen(5000, () => {
        console.log("Server has started!");
    });
})