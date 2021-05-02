var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const UsersController = require("../controllers/usersController");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
    // get all users (not that we'd want to do that...)
});

router.get("/:userId", UsersController.get_one_user);

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
router.post("/signup", UsersController.create_new_user);
router.post("/login", UsersController.login_user);

module.exports = router;
