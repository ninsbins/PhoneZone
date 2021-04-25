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
router.post("/signup", UsersController.create_new_user);
router.post("/login", UsersController.login_user);

module.exports = router;
