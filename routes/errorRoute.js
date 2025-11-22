const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Route to trigger an intentional 500 error
router.get("/cause-error", errorController.throwError)

module.exports = router