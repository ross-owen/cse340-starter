// Needed Resources
const express = require("express")
const router = new express.Router()
const controller = require("../controllers/invController")
const validator = require("../utilities/inventory-validation");
const utilities = require("../utilities");


router.get("/", controller.buildManagement);
router.get("/type/:classificationId", controller.buildByClassificationId);
router.get("/detail/:id", controller.buildByInventoryId);

router.get("/classification", controller.buildNewClassification);
router.post('/classification',
    validator.classificationRules(),
    validator.classificationDataCheck,
    utilities.handleErrors(controller.addClassification)
)

router.get("/vehicle", controller.buildNewVehicle);
router.post('/vehicle',
    validator.vehicleRules(),
    validator.vehicleDataCheck,
    utilities.handleErrors(controller.addVehicle)
)

router.get("/getInventory/:classificationId", utilities.handleErrors(controller.getInventoryJson))
router.get("/edit/:vehicleId", utilities.handleErrors(controller.buildEditVehicle))
router.post("/update",
    validator.vehicleRules(),
    validator.updateVehicleDataCheck,
    utilities.handleErrors(controller.updateVehicle)
)

router.get('/delete/:vehicleId', utilities.handleErrors(controller.buildDeleteVehicle))
router.post("/delete", utilities.handleErrors(controller.deleteVehicle))

router.get("/server-error", controller.buildServerError);

module.exports = router;
