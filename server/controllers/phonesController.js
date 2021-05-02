const mongoose = require("mongoose");
const Phone = require("../models/phone");

exports.create_new_listing = async (req, res, next) => {
    //create a new phone listing

    console.log("creating phone listing");
    console.log(req.body);

    //need to check if seller is valid?

    try {
        const phone = new Phone(req.body);
            // {       
            // _id = new mongoose.Types.ObjectId(),
            // title: req.body.title,
            // brand: req.body.brand,
            // image: req.body.image,
            // stock: req.body.stock,
            // seller: req.body.seller,
            // price: req.body.price,
            // reviews: req.body.reviews,
            // disabled: req.body.disabled,
        // });

        console.log(phone._id);

        phone.save().then((result) => {
            res.status(201).json({
                message: "phone listing created",
            })
        }).catch((err) => {
            if (!res.headerSent) {
                res.status(500).json({
                    message: "unable to create phone listing",
                    error: err.message,
                });
            }
        });

    } catch (err) {
        res.status(500).json({
            message: "unable to create phone listing",
            error: err.message,
        });
    }

    // // isListingValid().then((result) => {
    // const phone = new Phone({

    // });



    //     }).catch((err) => {
    //             if (!res.headerSent) {

    //             }
    //         });
    // })
    // .catch((error) => {
    //     console.log("validation error");
    //     console.log(error);
    //     res.status(500).json({
    //         message: "invalid phone listing",
    //     });
    // });

};

exports.get = (req, res, next) => {
    try {
        Phone.findOne(req.body);
        console.log(result);
    } catch (err) {
        res.status(500).json({
            message: "unable to get phone listing",
            error: err.message,
        });
    }
    
};

exports.sold_out_soon = (req, res, next) => {
    // get 5 phones with lowest quantity
    //
    Phone.find({ stock: { $gte: 1 }, disabled: { $exists: false } })
        .sort({ stock: 1 })
        .limit(5)
        .populate('seller') // get seller information via reference
        .exec()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });

};

exports.best_sellers = (req, res, next) => {
    // get 5 phones with highest rating
}
