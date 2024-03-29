var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const PhonesController = require("../controllers/phonesController");
const UsersController = require("../controllers/usersController");

/* POST new phone listing */
router.post("/createlisting", UsersController.authenticate, PhonesController.create_new_listing);

router.get("/soldoutsoon", PhonesController.sold_out_soon);

router.get("/search/", PhonesController.search);
router.get("/brands", PhonesController.get_brands);
router.get("/mostexpensive", PhonesController.get_most_expensive_phone);

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
router.put("/disable", UsersController.authenticate, PhonesController.disable_listing);

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
router.put("/enable", UsersController.authenticate, PhonesController.enable_listing);

router.put("/delete", UsersController.authenticate, PhonesController.delete_listing);


/* GET phone listing from id */
router.get("/:id", PhonesController.get_phone_from_id);

module.exports = router;
