const mongoose = require("mongoose");

const brands = ["Samsung", "Apple", "HTC", "Huawei", "Nokia", "LG", "Motorola", "Sony", "BlackBerry"];

const reviewSchema = new mongoose.Schema({
    reviewer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
});


const phoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
        enum: brands,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    seller: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    reviews: {
        type: [reviewSchema],
        required: true,
    },
    disabled: {
        type: String,
    },
});
    
module.exports = mongoose.model("Phone", phoneSchema);
