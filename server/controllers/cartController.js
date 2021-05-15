const mongoose = require("mongoose");
const Phone = require("../models/phone");
const { Cart, CartItem } = require("../models/cart");
const User = require("../models/user");
const { populate } = require("../models/phone");

// requires userid, phoneid, optional quantity (adds 1 if not present)
exports.add_to_cart = (req, res, next) => {
    let userId = req.body.userId;
    let phoneId = req.body.phoneId;
    let quantity = Number(req.body.quantity);

    User.findById(userId)
        .then(async (result) => {
            console.log(result);
            if (result.cart) {
                // if there's already a cart..
                // check if item already exists, if not add item to cart
                let cartId = result.cart._id;

                try {
                    let cart = await Cart.findOne(cartId);

                    let itemIndex = cart.items.findIndex((p) =>
                        p.product.equals(phoneId)
                    );

                    console.log(itemIndex);
                    console.log(`item at index ${cart.items[itemIndex]}`);

                    if (itemIndex > -1) {
                        // item exists in the cart, update the quantity
                        cart.items[itemIndex].quantity = quantity
                            ? (cart.items[itemIndex].quantity += quantity)
                            : 1;
                        await cart
                            .save()
                            .then((result) => {
                                console.log(result.items);

                                return res.status(200).json({
                                    message: "updated quantity in cart",
                                    cart: result.items,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                return res
                                    .status(500)
                                    .json({ message: "error", error: err });
                            });
                    } else {
                        // item doesn't exit, add new
                        const item = new CartItem({
                            product: phoneId,
                            quantity: 1,
                        });

                        cart.items.push(item);
                        await cart
                            .save()
                            .then((result) => {
                                console.log(result);
                                return res.status(200).json({
                                    message: "added new item in cart",
                                    cart: result.cart.items,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                return res.status(500);
                            });
                    }
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "something went wrong...check server log",
                    });
                }
            } else {
                // create cart and add item
                const cart = new Cart({
                    _id: new mongoose.Types.ObjectId(),
                    items: [],
                    order_total: 0,
                    completed: false,
                });

                // add cart item
                const item = new CartItem({
                    product: phoneId,
                    quantity: quantity ? quantity : 1,
                });

                cart.items.push(item);
                cart.save().then((result) => {
                    User.findByIdAndUpdate(userId, { cart: cart })
                        .then((result) => {
                            return res.status(200).json({
                                message: "created and added to cart",
                                user: result._id,
                                cart: result.cart.items,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(500).json({
                                message: "unable to create or add to cart",
                                error: err,
                            });
                        });
                });
            }
        })
        .catch((error) => {
            return res.status(500).json({
                message: "not added to cart",
                error: error,
            });
        });
};

exports.get_cart = async (req, res, next) => {
    let userId = req.query.userId;

    User.findById(userId)
        .populate({
            path: "cart",
            populate: { path: "items.product" },
        })
        .then((result) => {
            console.log(result);
            return res.status(200).json({
                message: "got cart!",
                cart: result.cart,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: "unable to fetch cart!",
                error: "check server logs",
            });
        });
};

exports.remove_product_from_cart = (req, res, next) => {
    return res.status(200).json({
        message: "removed product",
    });
};

exports.update_quantity = (req, res, next) => {
    return res.status(200).json({
        message: "updated product",
    });
};

exports.clear_cart = (req, res, next) => {
    return res.status(200).json({
        message: "cart cleared",
    });
};
