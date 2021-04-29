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

/**
 * /phones/disable:
 * put:
 *      description: used to disable a particular phone listing
 *      parameters:
 *          - name: phoneId
 *            description: the id of the phone listing
 *      responses:
 *          '200':
 *              description: successfully disabled phone listing
 *          '400':
 *              description: unsuccessful
 *
 */
router.put("/disable", PhonesController.disable_listing);

/**
 * /phones/enable:
 * put:
 *      description: used to enable a particular phone listing
 *      parameters:
 *          - name: phoneId
 *            description: the id of the phone listing
 *      responses:
 *          '200':
 *              description: successfully enabled phone listing
 *          '400':
 *              description: unsuccessful
 *
 */
router.put("/enable", PhonesController.enable_listing);

module.exports = router;
