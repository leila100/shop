const knex = require("knex")
const knexConfig = require("../../knexfile")

const db = knex(knexConfig.development)

module.exports = {
  save,
  getCart,
  getProducts,
  addProduct,
  updateProduct
}

function save(id) {
  return db("carts").insert(id)
}

function getCart(id) {
  return db("carts")
    .where({ user_id: Number(id) })
    .first()
}

function getProducts(cart_id) {
  return db
    .select("products.*", "cartItems.quantity")
    .from("products")
    .innerJoin("cartItems", "products.id", "cartItems.product_id")
    .where({ "cartItems.cart_id": Number(cart_id) })
}

function addProduct(product_id, cart_id) {
  return db("cartItems")
    .insert({ quantity: 1, product_id: product_id, cart_id: cart_id })
    .then(ids => ({ id: ids[0] }))
}

function updateProduct(prodId, cartId, qty) {
  return db("cartItems")
    .update({ quantity: qty, product_id: prodId, cart_id: cartId })
    .where({ cart_id: cartId, product_id: prodId })
}
