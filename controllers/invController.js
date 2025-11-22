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

module.exports = invCont