var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
// const UsersController = require("../controllers/usersController");
const OrdersController = require("../controllers/ordersController");
const Order = require("../models/order");

/* GET users listing. */
router.get("/", function (req, res, next) {
    // res.send("respond with a resource");
    // get all users (not that we'd want to do that...)
    res.send("hit order route");
});

router.post("/", OrdersController.create_new_order);

module.exports = router;
