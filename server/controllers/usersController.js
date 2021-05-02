const mongoose = require("mongoose");
const User = require("../models/user");
const crypto = require("crypto");

const encryptPassword = (string) => {
    return crypto.createHash("md5").update(string).digest("hex");
};

const isValidEmail = (string) => {
    const regex = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regex.test(string);
};

const isValidPassword = (string) => {
    // equal to or longer than 4 characters?
    return string.length >= 4;
    // add additional password requirements here.
};

// const validatePassword = (plaintext, hashedPassword) => {
//     let plainToHash = crypt.createHash('md5').update(plaintext).digest('hex');
//     return plainToHash == hashedPassword
// }

/**
 * /users/signup:
 * post:
 *      description: use to sign up a new user
 *      parameters:
 *          - name: firstName
 *            description: first name for the user
 *            required: true
 *            type: string
 *          - name: lastName
 *            description: last name for the user
 *            required: true
 *            type: string
 *          - name: email
 *            description: email for the user
 *            required: true
 *            type: string
 *          - name: password
 *            description: password for the user
 *            required: true
 *            type: string
 *      responses:
 *          '201':
 *              description: User successfully created
 *          '409':
 *              description: User unable to be created
 *          '500':
 *              description: Server error
 *
 */
exports.create_new_user = (req, res, next) => {
    // functionality for creating a new user.
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;

    if (!isValidEmail(email)) {
        return res.status(409).json({
            message: "invalid email",
        });
    }

    if (!isValidPassword(password)) {
        return res.status(409).json({
            message: "invalid password",
        });
    }

    // encrypt password and
    User.find({ email: email })
        .exec()
        .then((result) => {
            if (result.length >= 1) {
                return res.status(409).json({
                    message: "username exists",
                });
            } else {
                let hashedPassword = encryptPassword(password);
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    password: hashedPassword,
                });

                newUser
                    .save()
                    .then((result) => {
                        console.log(result);
                        res.status(201).json({
                            message: "user created",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(409).json({
                            message: "user unable to be created",
                        });
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: "server error",
            });
        });

    // First name
    // Last Name
    // Email
    // Password

    // note: email is username.
};

exports.get = (req, res, next) => {
    const id = req.body.id;

    User.findById(id).then().then((result) => {
        console.log(result);
        return res.status(200).json({
            message: "user returned",
            user: result
        })
    }).catch((err) => {
        return res.status(400).json({
            message: "unable to get user with this id",
            error: err.message
        });
    })
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

exports.update_user = (req, res, next) => {
    //update an existing user entry

    const id = req.body.id;

    User.updateOne({ _id: id }, {
        firstname: {$set: req.body.firstname},
        lastname: {$set: req.body.lastname},
        email: {$set: req.body.email},
        //update password?
    }).then((result) => {
        console.log(result);
        res.status(200).json({
            message: "user was updated",
            user: result
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "user could not be updated",
            error: err.message
        });
    });

}

exports.login_user = (req, res, next) => {
    // functionality for checking login details and signing in user.
    // authentication and auth middleware, then
    //
};
