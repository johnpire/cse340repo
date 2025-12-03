const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const invContUponClick = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * retrieve the data for a specific vehicle in inventory, based on the inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const vehicle = await invModel.getInventoryById(req.params.inv_id);
  const vehicleDetail = await utilities.buildVehicleDetail(vehicle);
  let nav = await utilities.getNav();
  res.render("inventory/vehicleDetail", { 
    vehicleDetail, 
    title: vehicle.inv_make + ' ' + vehicle.inv_model,
    nav
  });
}

/* ***************************
 * TASK 1: Creation of a management view that will contain the links to begin and end the processes for tasks 2 and 3.
 * ************************** */
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 * TASK 2: Add new classification to the nav
 * ************************** */
invCont.buildClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.verifyClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result && result.rows && result.rows.length > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'ve successfully added ${classification_name} Classification.`
    )
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, addition of Classification is unsuccesful.")
    res.redirect("/inv/");
  }
}

/* ***************************
 * TASK 3: Add new Vehicle to the classifications
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: null
    });
  } catch (error) {
    console.error("Error rendering Add Vehicle form:", error);
    res.status(500).send("Unable to load form");
  }
};

invCont.registerNewCar = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const result = await invModel.addNewVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result) {
    req.flash(
      "notice",
      `Congratulations, you've successfully added ${inv_make} car.`
  );
  res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, attempt to register a new car has failed.");
    res.redirect("/inv/");
  }
}

module.exports = invCont