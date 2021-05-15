var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const UsersController = require("../controllers/usersController");
const OrdersController = require("../controllers/ordersController");
const Order = require("../models/order");

const cartController = require("../controllers/cartController");

// add to cart
router.put("/addToCart", cartController.add_to_cart);

// remove from cart
router.put("/removeFromCart", cartController.remove_product_from_cart);

// update quantity from cart
router.put("/updateQuantity", cartController.update_quantity);

// get users cart.
router.get("/", cartController.get_cart);

// clear cart
router.delete("/", cartController.clear_cart);

module.exports = router;
