const pool = require("../database/")

/* ***************************
 *  Add item to cart
 * ************************** */
async function addToCart(account_id, inv_id) {
  try {
    const sql = "INSERT INTO cart (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    console.error("addToCart error: " + error)
    return null
  }
}

/* ***************************
 *  Get user's cart items (with vehicle details)
 * ************************** */
async function getCartItems(account_id) {
  try {
    const sql = `
      SELECT 
        c.cart_id, 
        c.inv_id, 
        c.date_added,
        i.inv_make, 
        i.inv_model, 
        i.inv_year,
        i.inv_description,
        i.inv_image,
        i.inv_thumbnail,
        i.inv_price,
        i.inv_miles,
        i.inv_color
      FROM cart c
      JOIN inventory i ON c.inv_id = i.inv_id
      WHERE c.account_id = $1
      ORDER BY c.date_added DESC
    `
    return await pool.query(sql, [account_id])
  } catch (error) {
    console.error("getCartItems error: " + error)
    return null
  }
}

/* ***************************
 *  Remove item from cart
 * ************************** */
async function removeFromCart(cart_id) {
  try {
    const sql = "DELETE FROM cart WHERE cart_id = $1"
    return await pool.query(sql, [cart_id])
  } catch (error) {
    console.error("removeFromCart error: " + error)
    return null
  }
}

/* ***************************
 *  Clear entire cart for a user
 * ************************** */
async function clearCart(account_id) {
  try {
    const sql = "DELETE FROM cart WHERE account_id = $1"
    return await pool.query(sql, [account_id])
  } catch (error) {
    console.error("clearCart error: " + error)
    return null
  }
}

/* *****************************
*   Check if item is already in user's cart
* *************************** */
async function checkIfInCart(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM cart WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows.length > 0  // returns true if item exists, false if not
  } catch (error) {
    console.error("checkIfInCart error:", error)
    return false
  }
}

module.exports = { addToCart, getCartItems, removeFromCart, clearCart, checkIfInCart }