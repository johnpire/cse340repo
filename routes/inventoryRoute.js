// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const newCarValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Route for View Maanagement
router.get(
    "/",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildManagementView));

// Route for Adding Classification
router.get(
    "/add-classification",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildClassification));
// Route for Posting Classification error
router.post(
    "/add-classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.verifyClassification)
);

// Route for Adding Vehicle page and dropdown option view
router.get(
    "/add-inventory",
    utilities.checkAuthorization,
    utilities.handleErrors(invController.buildAddInventory));
// Route for validating and adding the data to the database
router.post(
    "/add-inventory",
    newCarValidate.carAdditionRules(),
    newCarValidate.checkCarData,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.registerNewCar)
);

router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON))

// Route for Editing Vehicles
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
// Route for Updating Edited Vehicles
router.post(
    "/update/",
    newCarValidate.carAdditionRules(),
    newCarValidate.checkCarData,
    utilities.handleErrors(invController.updateInventory))

// Route for Deleting Vehicles
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView));
// Route for Confirming Deletion
router.post(
    "/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;