var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

// DB SETUP
const mongoDBUri =
    "mongodb+srv://matt:testadmin@phonezone.ixyyf.mongodb.net/phonezone?retryWrites=true&w=majority";
mongoose
    .connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((err) => {
        console.log("Error connecting to database");
        console.log(err.message);
    });

var indexRouter = require("./routes/index");
var usersRoutes = require("./routes/users");
var phoneRoutes = require("./routes/phones");

// APP SETUP
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));

// ROUTES
app.use("/", indexRouter);
app.use("/users", usersRoutes);
app.use("/phones", phoneRoutes);

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    next();
});

// LAST DITCH ERROR CATCHING
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error); // forward the request
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
