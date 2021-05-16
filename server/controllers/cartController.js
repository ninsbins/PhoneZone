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
    // let cartId = req.body.cartId;

    User.findById(userId)
        .then(async (result) => {
            console.log(result);
            if (result.cart) {
                // if there's already a cart..
                // check if item already exists, if not add item to cart
                let cartId = result.cart._id;

                try {
                    let cart = await Cart.findOne(cartId);

                    if (cart.items) {
                        let itemIndex = cart.items.findIndex((p) =>
                            p.product.equals(phoneId)
                        );

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
                                    return res.status(500).json({
                                        message: "error",
                                        error: err,
                                    });
                                });
                        } else {
                            console.log("HIT NEW ITEM");
                            // item doesn't exit, add new
                            const item = new CartItem({
                                product: phoneId,
                                quantity: quantity ? quantity : 1,
                            });

                            cart.items.push(item);
                            await cart
                                .save()
                                .then((result) => {
                                    console.log(result);
                                    return res.status(200).json({
                                        message: "added new item in cart",
                                        // cart: result.cart.items,
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(500);
                                });
                        }
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

// cartId, productId
exports.remove_product_from_cart = async (req, res, next) => {
    let phoneId = req.body.productID;
    let cartId = req.body.cartId;

    // console.log(`phone id: ${phoneId}`);

    const cart = await Cart.findOne({ _id: cartId });

    if (cart) {
        let cartItemIndex = cart.items.findIndex((item) =>
            item.product.equals(phoneId)
        );
        console.log(cartItemIndex);

        if (cartItemIndex > -1) {
            cart.items = cart.items.filter(
                (item) => !item.product.equals(phoneId)
            );
        }
        console.log(cart);

        cart.save()
            .then((result) => {
                console.log(result);
                return res
                    .status(200)
                    .json({ message: "phone deleted from cart" });
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(500)
                    .json({ message: "unable to delete from cart" });
            });
    }
};

exports.update_quantity = (req, res, next) => {
    return res.status(200).json({
        message: "updated product",
    });
};

exports.clear_cart = async (req, res, next) => {
    let userId = req.body.userId;

    // get user and get the cart id, remove the cart.

    User.findByIdAndUpdate(userId, { cart: [] })
        .then((result) => {
            let cartId = result.cart._id;
            Cart.findByIdAndDelete(cartId)
                .then((result) => {
                    return res.status(200).json({ message: "cart cleared" });
                })
                .catch((err) => {
                    console.log(err);
                    return res
                        .status(500)
                        .json({ message: "unable to clear cart" });
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "unable to clear cart" });
        });
};
