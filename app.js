const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const routes = require("./routes");

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", routes);

app.get("/", function (req, res) {
    res.render("home");
});

module.exports = app;