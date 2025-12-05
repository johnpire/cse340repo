const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to get account
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to register  
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
) 

// Process the login request
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
)
// Route for Account Maanagement
router.get(
  "/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView
))

module.exports = router