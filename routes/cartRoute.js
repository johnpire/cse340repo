const express = require("express")
const router = new express.Router()
const cartController = require("../controllers/cartController")
const utilities = require("../utilities")

// Route to view cart
router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(cartController.buildCart)
)

// Route to add item to cart
router.post(
    "/add",
    utilities.checkLogin,
    utilities.handleErrors(cartController.addToCart))

// Route to remove item from cart
router.post(
    "/remove",
    utilities.checkLogin,
    utilities.handleErrors(cartController.removeFromCart))

// Route to clear entire cart
router.post(
  "/clear",
  utilities.checkLogin,
  utilities.handleErrors(cartController.clearCart)
)

module.exports = router