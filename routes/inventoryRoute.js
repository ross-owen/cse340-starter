// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validator = require("../utilities/inventory-validation");
const utilities = require("../utilities");


router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:id", invController.buildByInventoryId);

router.get("/classification", invController.buildNewClassification);
router.post('/classification',
    validator.classificationRules(),
    validator.classificationDataCheck,
    utilities.handleErrors(invController.addClassification)
)

router.get("/vehicle", invController.buildNewVehicle);
router.post('/vehicle',
    validator.vehicleRules(),
    validator.vehicleDataCheck,
    utilities.handleErrors(invController.addVehicle)
)

router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJson))
router.get("/edit/:vehicleId", utilities.handleErrors(invController.buildEditVehicle))
router.post("/update",
    validator.vehicleRules(),
    validator.updateVehicleDataCheck,
    utilities.handleErrors(invController.updateVehicle)
)

router.get("/server-error", invController.buildServerError);

module.exports = router;
