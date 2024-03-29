const mongoose = require("mongoose");
const Phone = require("../models/phone");
const { Cart, CartItem } = require("../models/cart");
const User = require("../models/user");
const { populate } = require("../models/phone");
const phoneController = require("./phonesController");

// requires userid, phoneid, optional quantity (adds 1 if not present)
exports.add_to_cart = (req, res, next) => {
    let userId = req.user.userId;
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
                    let cart = await Cart.findOne(cartId).populate(
                        "items.product"
                    );

                    if (cart.items) {
                        let itemIndex = cart.items.findIndex((p) =>
                            p.product.equals(phoneId)
                        );

                        if (itemIndex > -1) {
                            // item exists in the cart, update the quantity
                            cart.items[itemIndex].quantity = quantity
                                ? (cart.items[itemIndex].quantity += quantity)
                                : 1;
                            cart.order_total = computeOrderTotal(cart);
                            // let total = computeTotal(cart);
                            // cart.order_total = total;
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

                            let total = 0;
                            for (let i = 0; i < cart.items.length - 1; i++) {
                                total +=
                                    Number(cart.items[i].quantity) *
                                    Number(cart.items[i].product.price);
                            }
                            let phone = await Phone.findById(phoneId);
                            total += phone.price * quantity;
                            cart.order_total = total;

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

                let phone = await Phone.findById(phoneId);
                let total = phone.price * quantity;
                cart.order_total = total;

                cart.save().then((result) => {
                    User.findByIdAndUpdate(userId, { cart: cart })
                        .then((result) => {
                            return res.status(200).json({
                                message: "created and added to cart",
                                user: result._id,
                                // cart: result.cart.items,
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
    let userId = req.user.userId;

    // let userId = req.query.userId;

    User.findById(userId)
        .populate({
            path: "cart",
            populate: { path: "items.product" },
        })
        .then((result) => {
            console.log(result);

            let totalNumItems = getTotalItems(result.cart);

            return res.status(200).json({
                message: "got cart!",
                cart: result.cart,
                totalItems: totalNumItems,
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
    let phoneId = req.body.productId;
    let cartId = req.body.cartId;

    console.log(`phoneId: ${phoneId} cartId: ${cartId}`);

    // console.log(`phone id: ${phoneId}`);

    const cart = await Cart.findOne({ _id: cartId }).populate("items.product");

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
        cart.order_total = computeOrderTotal(cart);

        // let total = computeTotal(cart);
        // cart.order_total = total;

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

exports.decrease_quantity = async (req, res, next) => {
    let cartId = req.body.cartId;
    let phoneId = req.body.productId;
    let cart = await Cart.findOne({ _id: cartId }).populate("items.product");

    let indexOfItem = cart.items.findIndex((item) =>
        item.product.equals(phoneId)
    );
    if (indexOfItem > -1) {
        if (cart.items[indexOfItem].quantity - 1 <= 0) {
            // remove cart item.
            cart.items = cart.items.filter(
                (item) => !item.product.equals(phoneId)
            );
        } else {
            cart.items[indexOfItem].quantity--;
        }
    }

    // let total = await computeTotal(cart);
    // cart.order_total = total;
    cart.order_total = computeOrderTotal(cart);

    cart.save()
        .then((result) => {
            console.log(result);
            return res
                .status(200)
                .json({ message: "decreased quantity by one" });
        })
        .catch((err) => {
            console.log(err);
            return res
                .status(500)
                .json({ message: "unable to decrease quantity" });
        });
};

const getTotalItems = (cart) => {
    let totalItems = 0;
    cart.items.forEach((item) => {
        totalItems += Number(item.quantity);
    });
    return totalItems;
};

const computeOrderTotal = (cart) => {
    let total = 0;
    cart.items.forEach((item) => {
        console.log(`q${item.quantity} p${item.product.price}`);
        total += Number(item.quantity) * Number(item.product.price);
    });

    return total;
};

exports.increase_quantity = async (req, res, next) => {
    // need to add validation that the increase won't be over stock (already on frontend but never trust it!)
    let cartId = req.body.cartId;
    let phoneId = req.body.productId;
    let cart = await Cart.findOne({ _id: cartId }).populate("items.product");

    let indexOfItem = cart.items.findIndex((item) =>
        item.product.equals(phoneId)
    );
    if (indexOfItem > -1) {
        cart.items[indexOfItem].quantity++;
    }

    cart.order_total = computeOrderTotal(cart);

    cart.save()
        .then((result) => {
            console.log(result);
            return res
                .status(200)
                .json({ message: "increased quantity by one" });
        })
        .catch((err) => {
            console.log(err);
            return res
                .status(500)
                .json({ message: "unable to increase quantity" });
        });
};

exports.clear_cart = async (req, res, next) => {
    let userId = req.user.userId;

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

exports.checkout = async (req, res, next) => {
    if (req.body.cartId === undefined || req.user === undefined) {
        return res.status(500).json({ message: "unable to get cart" });
    }

    let cartId = req.body.cartId;
    let userId = req.user.userId;

    console.log(`cartId: ${cartId} userId: ${userId}`);

    // validate order first (it should be valid but best to check)

    // return res.status(500).json({ message: "rejected order" });

    // set cart completed to true.
    let cart = await Cart.findById({ _id: cartId });

    try {
        let valid = await isOrderValid(userId, cart.items);
        console.log(valid);
        // console.log(valid.result)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "invalid order" });
    }

    cart.completed = true;
    // update stock.

    cart.items.forEach((item) => {
        // find phone, deduct quantity
        phoneController.update_quantity(item.product._id, item.quantity);
    });

    await cart
        .save()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "something went wrong" });
        });

    // move cart from user's cart to previous_orders

    let user = await User.findById(userId);
    user.previousOrders = [...user.previousOrders, cart];
    user.cart = undefined;

    user.save()
        .then((result) => {
            return res.status(200).json({ message: "successful order" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "something went wrong" });
        });
};

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
                phoneController
                    .has_valid_items(items)
                    .then((result) => {
                        resolve("valid order");
                    })
                    .catch((err) => {
                        console.log(err);
                        reject("not a valid order");
                    });
            })
            .catch((err) => {
                //
                reject("not a valid order");
            });
    });
};
