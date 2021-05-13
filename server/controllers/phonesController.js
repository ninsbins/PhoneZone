const mongoose = require("mongoose");
const Phone = require("../models/phone");

exports.create_new_listing = async (req, res, next) => {
    //create a new phone listing

    console.log("creating phone listing");
    console.log(req.body);

    let phone = new Phone({
        title: req.body.title,
        brand: req.body.brand,
        image: req.body.brand+".jpg",
        stock: req.body.stock,
        seller: req.user.userId,
        price: req.body.price,
        reviews: [],            // We can't let the user add reviews themselves
    });
    if(req.body.disabled){
        phone.disabled = "";
    }

    console.log(phone._id);

    phone.save().then((result) => {
        console.log(result);

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

};

exports.get_brands = (req, res, next) => {
    res.status(200).json({
        message: "phone brands returned",
        brands: ["Samsung", "Apple", "HTC", "Huawei", "Nokia", "LG", "Motorola", "Sony", "BlackBerry"]
    });
}

exports.get_most_expensive_phone = (req, res, next) => {
    Phone.find().sort({price: -1}).limit(1).then((result) => {
        res.status(200).json({
            message: "phone listing returned",
            phone: result
        });
    }).catch((err) => {
        res.status(500).json({
            message: "unable to get phone listing",
            error: err.message,
        });
    })
}

exports.get_phone_from_id = (req, res, next) => {
    const id = req.params.id;

    console.log(id);

    Phone.findById(id).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "phone listing returned",
            phone: result,
        });
    }).catch((err) => {
        res.status(500).json({
            message: "unable to get phone listing",
            error: err.message,
        });
    });

};

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

    Phone.find({ title: { $regex: search_term, $options: "i" } })
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
};

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

    // check that this phone is sold by this user
    let userId = req.user.userId;
    Phone.findById(phoneId).then((result)=> {
        if(userId == result.seller){
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
        } else {
            return res.status(401).send("Authentication Error");
        }
    });
};

exports.disable_listing = (req, res, next) => {
    // add disabled field to phone
    let phoneId = req.body.phoneId;

    // check that this phone is sold by this user
    let userId = req.user.userId;
    Phone.findById(phoneId).then((result)=> {
        if(userId == result.seller){
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
        } else {
            return res.status(401).send("Authentication Error");
        }
    });
};

exports.is_valid_order = async (phoneId, quantity) => {
    let valid_id = true;
    let valid_quantity = quantity > 0;

    // get stock of phone, and check that it's enough
    await Phone.findById(phoneId)
        .then((result) => {
            console.log(result);
            valid_quantity = valid_quantity && result.stock >= quantity;
        })
        .catch((err) => {
            console.log("Error getting quantity");
            valid_id = false;
        });
    return valid_id && valid_quantity;
};

exports.update_quantity = (phoneId, quantity) => {
    // reduce stock of phone by quantity

    Phone.findByIdAndUpdate(phoneId, {
        $inc: { stock: -quantity },
    })
        .then((result) => {
            console.log("updated stock of ${phoneId}");
        })
        .catch((err) => {
            throw "unable to update quantity of phone";
        });
};

exports.has_valid_items = async (items) => {
    return new Promise(async (resolve, reject) => {
        await Promise.all(
            items.map(async (item) => {
                let valid = await this.is_valid_order(
                    item.phoneListing,
                    item.quantity
                );
                if (!valid) {
                    reject("not valid items");
                }
            })
        );
        resolve("valid items");
    });
};
