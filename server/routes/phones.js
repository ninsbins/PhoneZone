var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const PhonesController = require("../controllers/phonesController");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.post("/createlisting", PhonesController.create_new_listing);
router.get("/get", PhonesController.get);
router.get("/soldoutsoon", PhonesController.sold_out_soon);

module.exports = router;
