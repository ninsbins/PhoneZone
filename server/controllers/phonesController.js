const mongoose = require("mongoose");
const Phone = require("../models/phone");

exports.sold_out_soon = (req, res, next) => {
    // get 5 phones with lowest quantity
    //
    Phone.find({ stock: { $gte: 1 }, disabled: { $exists: false } })
        .sort({ stock: 1 })
        .limit(5)
        .populate("seller") // get seller information via reference
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.search = (req, res, next) => {
    // Get 20 phones that match search term

    let search_term = req.query.search_term;
    console.log(search_term);

    Phone.find({title : {$regex : search_term, $options: 'i'}})
        .limit(20)
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.best_sellers = (req, res, next) => {
    // get 5 phones with highest average rating
    // reviews.count >= 2

    Phone.aggregate([
        {
            $match: {
                "reviews.1": { $exists: true },
                disabled: { $exists: false },
            },
        },
        { $addFields: { RatingAverage: { $avg: "$reviews.rating" } } },
    ])
        .sort({ RatingAverage: -1 })
        .limit(5)
        .then((result) => {
            console.log(result);
            return res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
};

exports.enable_listing = (req, res, next) => {
    // take away disable from phone
    let phoneId = req.body.phoneId;

    Phone.findByIdAndUpdate(phoneId, {
        $unset: { disabled: 1 },
    })
        .then((result) => {
            return res.status(200).json({
                message: "successfully enabled listing",
            });
        })
        .catch((err) => {
            return res.status(400).json({
                message: "unable to enable phone listing",
            });
        });
};

exports.disable_listing = (req, res, next) => {
    // add disabled field to phone
    let phoneId = req.body.phoneId;

    Phone.findByIdAndUpdate(phoneId, {
        disabled: "",
    })
        .then((result) => {
            return res.status(201).json({
                message: "successfully disabled",
            });
        })
        .catch((err) => {
            return res.status(400).json({
                message: "unable to disable phone listing",
            });
        });
};

exports.is_valid_order = async (phoneId, quantity) => {

    let valid_id = true;
    let valid_quantity = (quantity > 0);
    
    // get stock of phone, and check that it's enough
    await Phone.findById(phoneId).then((result) => {
        valid_quantity = valid_quantity && (result.stock >= quantity);
    }).catch((err) => {
        console.log("Error getting quantity");
        valid_id = false;
    });
    return valid_id && valid_quantity;
};

exports.update_quantity = (phoneId, quantity) => {
    // reduce stock of phone by quantity

    Phone.findByIdAndUpdate(phoneId, {
        $inc: { stock : -quantity },
    })
    .then((result) => {
        console.log("updated stock of ${phoneId}");
    })
    .catch((err) => {
        throw "unable to update quantity of phone";
    });
};
