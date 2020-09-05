const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const mongodb = require("mongodb");
const routes = require("./routes");
const { db , server} = require("./config/env");

const client = mongodb.MongoClient;

client.connect(db.uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}, (err, database) => {
    if (err) throw err;
    console.log(`databse has connected ${db.uri}`);
    database.close();
});

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", routes);

app.get("/", function (req, res) {
    res.render("home");
});

app.listen(server.port, (data) => {
    console.log(data)
})