const invModel = require("../models/inventory-model")
const AccModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' Vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle details view HTML upon classification click
* ************************************ */
Util.buildVehicleDetail = async function(vehicle, loggedin = false, inCart = false){
  if (!vehicle) return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  let detail = '';
  
  detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />';
  detail += '<div class="vehicleDetails">';
  detail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + vehicle.inv_year + ' Details</h2>';
  detail += '<p><strong>Price: </strong>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';
  detail += '<p><strong>Description: </strong>' + vehicle.inv_description + '</p>';
  detail += '<p><strong>Color: </strong>' + vehicle.inv_color + '</p>';
  detail += '<p><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>';
  
  // Add to cart button logic
  if (loggedin) {
    if (inCart) {
      // if item already in cart | might be more convenient to put this logic here than in controller
      detail += '<p class="in-cart-message">✓ This vehicle is already in your cart</p>';
      detail += '<a href="/cart" class="btn btn-cart">View Cart</a>';
    } else {
      // if not in cart
      detail += '<form action="/cart/add" method="post" class="add-to-cart-form" onsubmit="return confirm(\'Add this vehicle to your cart?\')">';
      detail += '<input type="hidden" name="inv_id" value="' + vehicle.inv_id + '">';
      detail += '<button type="submit" class="btn">Add to Cart</button>';
      detail += '</form>';
    }
  } else {
    // if not logged in
    detail += '<p class="login-prompt"><a href="/account/login">Log in</a> to add to cart</p>';
  }

  detail += '</div>';

  return detail;
}

/* **************************************
* Select classification_Id as means of options for drop-down options for form
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
* Middleware to check the user's account type utilizing JWT
* Only allows Employee or Admin access
**************************************** */
Util.checkAuthorization = async (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      async function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
      
        try {
          const result = await AccModel.getAccountByEmail(accountData.account_email)
          
          // Check if account type is Employee or Admin
          if (result && (result.account_type === 'Employee' || result.account_type === 'Admin')) {
            next() // this method is better than the initial boolean concept of this function
          } else {
            req.flash("notice", "You do not have permission to access this resource.")
            return res.redirect("/account/login")
          }
        } catch (error) {
          req.flash("notice", "Access denied.")
          return res.redirect("/account/login")
        }
      }
    )
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* **************************************
* Build the cart items view HTML
* ************************************ */
Util.buildCartView = async function(cartItems){
  let cartContent = ''
  
  if(cartItems && cartItems.length > 0){
    cartContent += '<div class="cart-items">'
    
    cartItems.forEach(item => {
      cartContent += '<div class="cart-item">'
      cartContent += '<a href="/inv/detail/' + item.inv_id + '">'
      cartContent += '<img src="' + item.inv_thumbnail + '" alt="' + item.inv_make + ' ' + item.inv_model + '">'
      cartContent += '</a>'
      
      cartContent += '<div class="cart-item-info">'
      cartContent += '<h3><a href="/inv/detail/' + item.inv_id + '">'
      cartContent += item.inv_make + ' ' + item.inv_model + ' ' + item.inv_year
      cartContent += '</a></h3>'
      cartContent += '<p class="cart-item-price">$' + new Intl.NumberFormat('en-US').format(item.inv_price) + '</p>'
      cartContent += '<p class="cart-item-color">Color: ' + item.inv_color + '</p>'
      cartContent += '</div>'
      
      cartContent += '<div class="cart-item-actions">'
      cartContent += '<form action="/cart/remove" method="post">'
      cartContent += '<input type="hidden" name="cart_id" value="' + item.cart_id + '">'
      cartContent += '<button type="submit" class="btn-remove">Remove</button>'
      cartContent += '</form>'
      cartContent += '</div>'
      
      cartContent += '</div>'
    })
    
    cartContent += '</div>'
    
    // Cart Summary
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.inv_price), 0) // will total the price of all items in cart
    cartContent += '<div class="cart-summary">'
    cartContent += '<h3>Cart Summary</h3>'
    cartContent += '<p class="cart-count">' + cartItems.length + ' item' + (cartItems.length !== 1 ? 's' : '') + '</p>'
    cartContent += '<p class="cart-total">Total: $' + new Intl.NumberFormat('en-US').format(total) + '</p>'
    cartContent += '<a href="/" class="btn">Continue Shopping</a>'
    cartContent += '<form action="/cart/clear" method="post" class="form-btn" onsubmit="return confirm(\'Clear all items from cart?\')">'
    cartContent += '<button type="submit" class="btn">Clear Cart</button>'
    cartContent += '</form>'
    cartContent += '</div>'
    
  } else {
    // if cart is empty
    cartContent += '<div class="empty-cart">'
    cartContent += '<p class="notice">Your cart is empty</p>'
    cartContent += '<a href="/" class="btn">Browse Vehicles</a>'
    cartContent += '</div>'
  }
  
  return cartContent
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util