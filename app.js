const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const expressLayiut = require('express-ejs-layouts');

const routes = require("./routes");

app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(expressLayiut);
app.use(express.static(__dirname + '/public'));

app.use("/", routes);

app.get("/", function (req, res) {
    res.render("index");
});

app.get('*', (req,res,send) => {
    const err = new Error(`${req.url} Not found`)
    err.status = 404;
    send(err)
})

app.use((err, req, res, send) => {
    res.locals.message = err.message;
    res.locals.status = err.status || 500;
    res.status(err.status || 500);
    console.log(err);
    res.render('error/');
})

module.exports = app;