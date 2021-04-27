const mongoose = require("mongoose");
const Phone = require("../models/phone");

exports.sold_out_soon = (req, res, next) => {
    // get 5 phones with lowest quantity
    //
    Phone.find({stock: {$gte: 1}, disabled: {$exists: false}})
        .sort({stock: 1})
        .limit(5)
        .populate('seller') // get seller information via reference
        .exec()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({error: err });
        });
                    
};

exports.best_sellers = (req, res, next) => {
    // get 5 phones with highest rating
}
