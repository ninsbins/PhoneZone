const mongoose = require("mongoose");
const Cart = require("./cart");

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: {
        type: String,
        required: true,
    },
    // need to attach user information like their phones etc once phone model is setup.
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: false,
    },
    previousOrders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: false,
        },
    ],
});

module.exports = mongoose.model("User", userSchema);
