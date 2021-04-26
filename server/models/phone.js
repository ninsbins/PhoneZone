const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewer:{
        type: String,
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
        type: String,
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
