const mongoose = require("mongoose");
const User = require("./user");
const Phone = require("./phone");

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    items: [
        {
            phoneListing: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Phone",
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("Order", orderSchema);
