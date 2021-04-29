var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const PhonesController = require("../controllers/phonesController");

/* GET phone listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.get("/soldoutsoon", PhonesController.sold_out_soon);

/**
 * GET top rated phones (top 5)
 */
router.get("/bestsellers", PhonesController.best_sellers);

module.exports = router;
