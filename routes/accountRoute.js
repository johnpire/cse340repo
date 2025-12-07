const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const accValidate = require('../utilities/account-validation')

// Route to get account
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to register  
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
  "/register",
  accValidate.registationRules(),
  accValidate.checkRegData,
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
  utilities.handleErrors(accountController.buildAccountManagementView)
)

// Route for logging out
router.get(
  "/logout", 
  utilities.handleErrors(accountController.logout)
)

// Route for update view
router.get(
  "/update",
  utilities.handleErrors(accountController.buildUpdateView)
)

// Route for update account confirmation
router.post(
  "/update",
  
  utilities.handleErrors(accountController.updateAccount)
)

// Route for update password confirmation
router.post(
  "/change-password",
  utilities.handleErrors(accountController.changePassword)
)

module.exports = router