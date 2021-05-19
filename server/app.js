var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

// DB SETUP
const mongoDBUri =
    "mongodb+srv://matt:testadmin@phonezone.ixyyf.mongodb.net/phonezonetester?retryWrites=true&w=majority";
mongoose
    .connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then()
    .catch((err) => {
        console.log("Error connecting to database");
        console.log(err.message);
    });

var indexRouter = require("./routes/index");
var usersRoutes = require("./routes/users");
var phoneRoutes = require("./routes/phones");
let orderRoutes = require("./routes/orders");
let cartRoutes = require("./routes/cart");

// APP SETUP
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/images", express.static("public/images"));

// ROUTES
app.use("/", indexRouter);
app.use("/users", usersRoutes);
app.use("/phones", phoneRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
// Fallback for the client-side routing.
app.get("/*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// CORS
// DEV: This is just for dev work, opens it up to any requests so not good security once we've built.
// Uncomment the Prod configuration and comment out the Dev version for final product.
// app.use(cors());
// app.options("*", cors());
// PROD:
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

app.listen(app.get("port"), () => {
    console.log(`Server listening at port: ${app.get("port")}`);
});

module.exports = app;
