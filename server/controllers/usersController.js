const mongoose = require("mongoose");
const User = require("../models/user");
const Phone = require("../models/phone");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Secret token
const accessTokenSecret =
    "9283jf9oewjfjsdiufhew293fwjehelpimtrappedinasecretfactoryaoweijfwuhew";

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
                        let payload = {
                            userId: newUser._id,
                            username: newUser.email,
                        };
                        const accessToken = jwt.sign(
                            payload,
                            accessTokenSecret,
                            {
                                expiresIn: "30m",
                            }
                        );

                        console.log(result);
                        res.status(201).json({
                            message: "user created",
                            token: accessToken,
                            userId: newUser._id,
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

exports.get_user_from_id = (req, res, next) => {
    const id = req.params.userId;

    User.findById(id, "-password")
        // .then()
        .then((result) => {
            console.log(result);
            return res.status(200).json({
                message: "user returned",
                user: result,
            });
        })
        .catch((err) => {
            return res.status(400).json({
                message: "unable to get user with this id",
                error: err.message,
            });
        });
};

exports.update_user = (req, res, next) => {
    //update an existing user entry

    // Get authenticated userId, passed through from authenticate middleware
    const id = req.user.userId;

    var user = {
        $set: req.body,
    };

    User.updateOne({ _id: id }, user)
        .then((result) => {
            console.log(result);
            res.status(200).json({
                message: "user was updated",
                operation: user,
                // result: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "user could not be updated",
                error: err.message,
            });
        });
};

/**
 * /users/login:
 * post:
 *      description: use to login
 *      parameters:
 *          - name: username
 *            description: username/email for the user
 *            required: true
 *            type: string
 *          - name: password
 *            description: password for the user
 *            required: true
 *            type: string
 *      responses:
 *          '200':
 *              description: User successfully logged in
 *              json returned:
 *                  token: <jwt_authentication_token>,
 *                  userId: <userId>
 *          '401':
 *              description: User unable to be logged in
 *          '500':
 *              description: Server error
 *
 */
exports.login_user = (req, res, next) => {
    // functionality for checking login details and signing in user.
    // authentication and auth middleware, then
    let username = req.body.username;
    let password = req.body.password;

    User.find({ email: username })
        .exec()
        .then((result) => {
            // get password hash, and compare
            if (result.length == 0) {
                res.status(401).json({
                    error: "Invalid username",
                });
            } else if (result[0].password == encryptPassword(password)) {
                // if same, return jwt
                let payload = { userId: result[0]._id, username: username };
                const accessToken = jwt.sign(payload, accessTokenSecret, {
                    expiresIn: "30m",
                });
                res.status(200).json({
                    token: accessToken,
                    userId: result[0]._id,
                });
            } else {
                res.status(401).json({
                    error: "Invalid password",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

/**
 * /users/change_password:
 * post:
 *      description: use to change password
 *      parameters:
 *          - name: oldpassword
 *            required: true
 *            type: string
 *          - name: newpassword
 *            required: true
 *            type: string
 *      responses:
 *          '200':
 *              description: User successfully changed password
 *          '401':
 *              description: Invalid password
 *          '500':
 *              description: Server error
 *
 */
exports.change_password = (req, res, next) => {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;

    let id = req.user.userId;
    console.log("changing password of: ", id);

    User.findById(id)
        .exec()
        .then((result) => {
            console.log(result);
            if (result.password == encryptPassword(oldpassword)) {
                let change = {
                    $set: { password: encryptPassword(newpassword) },
                };
                //update password
                User.updateOne({ _id: id }, change)
                    .then((result) => {
                        console.log(result);
                        res.status(200).json({
                            message: "password was updated",
                            operation: change,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            message:
                                "server error: password may or may not have updated",
                            error: err.message,
                        });
                    });
            } else {
                res.status(401).json({
                    error: "Invalid password",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "server error",
                error: err.message,
            });
        });
};

/**
 * /users/get_phones_sold_by/<uid>
 * GET
 *      description: returns a json list of all phones sold by user
 */
exports.get_phones_sold_by = (req, res, next) => {
    // list all phones sold by this user
    const id = req.params.userId;
    Phone.find({ seller: id })
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

/*********************
 * Middleware to be used on routes that should only be accessed by logged in user
 * e.g.
 * router.get("/asdf", UsersController.authenticate, <someController>.<actualfunction);
 *
 * This function adds a value called user to the request.
 * After authentication, in the controller function, the userId and username can
 * be accessed using req.user.userId and req.user.username.
 */
exports.authenticate = (req, res, next) => {
    // Authorization header must be: Bearer [JWT_TOKEN]

    if (req.headers.authorization) {
        // Get 2nd section of authorization header, containing token
        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.status(401).send("Error verifying token");
            }

            req.user = user; // contains userId and username
            console.log(req.user);
            console.log("verified authorization of", user);
            next();
        });
    } else {
        return res.status(401).send("No authorization header");
    }
};
