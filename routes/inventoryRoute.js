// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const newCarValidate = require("../utilities/newVehicle-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route for View Maanagement
router.get("/", invController.buildManagementView);

// Route for Adding Classification
router.get("/add-classification", invController.buildClassification);
// Route for Posting Classification error
router.post(
    "/add-classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    invController.verifyClassification
);

// Route for Adding Vehicle page and dropdown option view
router.get("/add-inventory", invController.buildAddInventory);
// Route for validating and adding the data to the database
router.post(
    "/add-inventory",
    newCarValidate.carAdditionRules(),
    newCarValidate.checkCarData,
    invController.registerNewCar
);


module.exports = router;