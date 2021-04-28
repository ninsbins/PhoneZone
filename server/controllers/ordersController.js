const mongoose = require("mongoose");
const Order = require("../models/order");
const Phone = require("../models/phone");
const { translateAliases } = require("../models/user");
const User = require("../models/user");

// example json body
// {
//     "orderedBy": "5f5237a4c1beb1523fa3da02",
//     "items": [
//         {
//             "phoneListing": "60847ab6f71df6d112cc6296",
//             "quantity": 1
//         }
//     ]
// }

exports.create_new_order = (req, res, next) => {
    // functionality for creating a new user.
    let items = req.body.items;
    let userId = req.body.orderedBy;

    let validOrder = checkOrderValidity(userId, items);

    console.log(`order valid? ${validOrder}`);

    if (validOrder) {
        // create new order
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            orderedBy: userId,
            items: items,
        });

        order
            .save()
            .then((result) => {
                res.status(201).json({
                    message: "order created successfully",
                });
            })
            .catch((err) => {
                console.log(err);
                if (!res.headerSent) {
                    res.status(500).json({
                        message: "unable to create new order",
                        error: err,
                    });
                }
            });

        // deduct quantities

        // search all phones for matching ids, if matching deduct the quantities
        items.forEach((item) => {
            // find phone, deduct quantity
            let num = -item.quantity;
            Phone.findByIdAndUpdate(item.phoneListing, {
                $inc: { stock: num },
            })
                .then((result) => {
                    console.log(
                        `updated stock of ${result._id}\ntitle: ${result.title}\nbrand: ${result.brand}`
                    );
                })
                .catch((err) => {
                    console.log("unable to update quantity of phone");
                });
        });
    } else {
        res.status(500).json({
            message: "invalid order details",
        });
    }
};

// HELPER FUNCTIONS
const isValidPhoneListing = (id) => {
    Phone.exists({ _id: id }, (err, result) => {
        if (err) {
            return false;
        }
    });
    return true;
};

const isValidQuantity = (num) => {
    if (!(num > 0)) {
        return false;
    }
    return true;
};

const checkOrderValidity = (userId, items) => {
    // Check that user exists
    let validUser = User.exists({ _id: userId }, (err, result) => {
        if (err) {
            return false;
        }
        return true;
    });

    // Check that phones exist and quantity is valid
    let validItems = items.forEach((item) => {
        // phone
        if (!isValidPhoneListing(item.phoneListing)) {
            return false;
        }

        // quantity
        if (!isValidQuantity(item.quantity)) {
            return false;
        }

        return true;
    });

    if (validItems && validUser) {
        return true;
    } else {
        return false;
    }
};
