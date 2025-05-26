// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validator = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:id", invController.buildByInventoryId);
router.get("/classification", invController.buildNewClassification);
router.post(
    '/classification',
    validator.classificationRules(),
    validator.classificationDataCheck,
    utilities.handleErrors(invController.addClassification)
)

router.get("/server-error", invController.buildServerError);

module.exports = router;
