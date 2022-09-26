/*
docker run -d --name mongodb \
    -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=toor \
    -v mongo_volume:/data/db \
    -p 27017:27017 \
    mongo
*/
const { mongoose } = require("mongoose");
const MongoHost = "localhost:27017"

// Load in db creds
const config = require('./mongo.json');
let database = null;

async function startDatabase() {
    mongoose.connect(`mongodb://${MongoHost}/${config.db}`, {
        auth: { username: config.username, password: config.password },
        authSource: "admin",
    });
    database = mongoose.connection;
    database.on("error", console.error.bind(console, "connection error: "));
    database.once("open", function () {
        console.log("Connected to db successfully");
    });
}

// Called externally
async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

module.exports = {
    getDatabase
};