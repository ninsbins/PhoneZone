const mongoose = require("mongoose");
const User = require("./user");
const Phone = require("./phone");

const cartItem = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phone",
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cartOwner: mongoose.Schema.Types.ObjectId,
    items: [cartItem],
    order_total: {
        type: Number,
    },
    completed: {
        type: Boolean,
    },
});

module.exports = {
    Cart: mongoose.model("Cart", cartSchema),
    CartItem: mongoose.model("CartItem", cartItem),
};
