const utilities = require('../utilities')
const cartModel = require("../models/cart-model.js")

/* ****************************************
*  Deliver cart view
* *************************************** */
async function buildCart(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  
  // Get cart items from database
  const cartData = await cartModel.getCartItems(account_id)
  const cartContent = await utilities.buildCartView(cartData ? cartData.rows : [])
  
  res.render("cart/view", {
    title: "Shopping Cart",
    nav,
    cartContent
  })
}

/* ****************************************
*  Add item to cart
* *************************************** */
async function addToCart(req, res, next) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id  
  const result = await cartModel.addToCart(account_id, parseInt(inv_id))
  
  if (result) {
    req.flash("notice", "Vehicle added to cart!")
    res.redirect("/cart")
  } else {
    req.flash("notice", "Unable to add vehicle to cart")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}


/* ****************************************
*  Remove item from cart
* *************************************** */
async function removeFromCart(req, res, next) {
  const { cart_id } = req.body
  
  if (!cart_id) {
    req.flash("notice", "Invalid request")
    return res.redirect("/cart")
  }
  
  const result = await cartModel.removeFromCart(cart_id)
  
  if (result) {
    req.flash("notice", "Vehicle removed from cart!")
  } else {
    req.flash("notice", "Unable to remove vehicle from cart")
  }
  
  res.redirect("/cart")  // ← Always redirect back to cart
}

/* ****************************************
*  Clear entire cart
* *************************************** */
async function clearCart(req, res, next) {
  const account_id = res.locals.accountData.account_id
  
  const result = await cartModel.clearCart(account_id)
  
  if (result) {
    req.flash("notice", "Cart cleared successfully!")
  } else {
    req.flash("notice", "Unable to clear cart")
  }
  
  res.redirect("/cart")
}

module.exports = { buildCart, addToCart, removeFromCart, clearCart }