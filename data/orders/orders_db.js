const knex = require("knex")
const knexConfig = require("../../knexfile")

const db = knex(knexConfig.development)

module.exports = {
  createOrder,
  saveOrderItem,
  getProducts
}

function createOrder(userId, total) {
  return db("orders")
    .insert({ user_id: userId, total: total })
    .then(ids => ({ id: ids[0] }))
}

function saveOrderItem(prodId, orderId, qty) {
  return db("orderItems")
    .insert({ product_id: prodId, order_id: orderId, quantity: qty })
    .then(ids => ({ id: ids[0] }))
}

function getProducts(orderId) {
  return db("products")
    .innerJoin("orderItems", "product_id", "products.id")
    .innerJoin("orders", "order_id", "orders.id")
    .where({ order_id: orderId })
}
