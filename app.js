const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const routes = require("./routes");

app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", routes);

app.get("/", function (req, res) {
    res.render("index");
});

app.use((err, req,res,send) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }
    res.status(500)
    res.render('error', {errors: err})
})


module.exports = app;