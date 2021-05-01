const mongoose = require("mongoose");
const phoneController = require("./phonesController");
const Order = require("../models/order");
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

exports.create_new_order = async (req, res, next) => {
    // functionality for creating a new user.
    let items = req.body.items;
    let userId = req.body.orderedBy;

    isOrderValid(userId, items)
        .then((result) => {
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

                    // deduct quantities
                    // search all phones for matching ids, if matching deduct the quantities
                    items.forEach((item) => {
                        // find phone, deduct quantity
                        phoneController.update_quantity(item.phoneListing, item.quantity)
                    });
                })
                .catch((err) => {
                    // console.log(err);
                    if (!res.headerSent) {
                        res.status(500).json({
                            message: "unable to create new order",
                            error: err,
                        });
                    }
                });
        })
        .catch((error) => {
            console.log("validation error");
            console.log(error);
            res.status(500).json({
                message: "invalid order details",
            });
        });
};

// HELPER FUNCTIONS
/***********************************
const isValidPhoneListing = async (id) => {
    let valid;

    await Phone.exists({ _id: id }, (err, result) => {
        if (err) {
            console.log("error validing phone id");
            valid = false;
        } else {
            valid = true;
        }
    });
    return valid;
};

const isValidQuantity = (num) => {
    if (!(num > 0)) {
        console.log("error on validating order quantity");
        return false;
    }
    return true;
};
******************************/

const isValidUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        await User.exists({ _id: id }, (err, result) => {
            if (!err) {
                resolve("user exists");
            } else {
                reject("no matching user");
            }
        });
    });
};

const isOrderValid = (userId, items) => {
    return new Promise(async (resolve, reject) => {
        isValidUser(userId)
            .then((result) => {
                let validItems = true;
                items.forEach((item) => {
                    validItems = validItems && 
                        phoneController.is_valid_order(item.phoneListing, item.quantity);
                });

                if (validItems) {
                    resolve("valid order");
                } else {
                    reject("not valid order");
                }
            })
            .catch((err) => {
                //
                reject("not a valid order");
            });
    });
};
