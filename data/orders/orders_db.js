const knex = require("knex")
const knexConfig = require("../../knexfile")

const db = knex(knexConfig.development)

module.exports = {
  createOrder,
  saveOrderItem,
  getProducts,
  getOrders,
  getOrderIds
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

function getOrders(userId) {
  return db
    .select("products.*", "orders.total", "orders.id as orderId")
    .from("products")
    .innerJoin("orderItems", "products.id", "orderItems.product_id")
    .innerJoin("orders", "orderItems.order_id", "orders.id")
    .where({ "orders.user_id": userId })
}

function getOrderIds(userId) {
  return db
    .select("orders.id")
    .from("orders")
    .where({ "orders.user_id": userId })
}
