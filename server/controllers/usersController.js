const mongoose = require("mongoose");
const User = require("../models/user");

exports.create_new_user = (req, res, next) => {
    // functionality for creating a new user.
    // create and return successful response or send an error
};

exports.get_one_user = (req, res, next) => {
    // functionality for getting the details of one user.
    // let userId = req.params.userId;

    User.findOne({ firstname: "Anita", lastname: "Simpson" })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: "user returned",
                user: {
                    firstname: result.firstname,
                    lastname: result.lastname,
                    email: result.email,
                },
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.login_user = (req, res, next) => {
    // functionality for checking login details and signing in user.
    // authentication and auth middleware, then
    //
};
