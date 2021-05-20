var express = require("express");
var router = express.Router();
// const mongoose = require("mongoose");
const UsersController = require("../controllers/usersController");
// const OrdersController = require("../controllers/ordersController");
// const Order = require("../models/order");

const cartController = require("../controllers/cartController");

// add to cart
router.put(
    "/addToCart",
    UsersController.authenticate,
    cartController.add_to_cart
);

// remove from cart
router.put(
    "/removeFromCart",
    UsersController.authenticate,
    cartController.remove_product_from_cart
);

// increase quantity of product
router.put(
    "/increaseQuantity",
    UsersController.authenticate,
    cartController.increase_quantity
);

// decrease quantity of product
router.put(
    "/decreaseQuantity",
    UsersController.authenticate,
    cartController.decrease_quantity
);

router.post("/checkout", UsersController.authenticate, cartController.checkout);

// get users cart.
router.get("/", UsersController.authenticate, cartController.get_cart);

// clear cart
router.delete("/", UsersController.authenticate, cartController.clear_cart);

module.exports = router;
