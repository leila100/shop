const Cart = require("../../models/cart")

const knex = require("knex")
const knexConfig = require("../../knexfile")

const db = knex(knexConfig.development)

module.exports = {
  fetchAll,
  findById,
  save,
  updateById,
  deleteById
}

function save(product) {
  return db("products").insert(product)
}

function fetchAll() {
  return db("products")
}

function findById(id) {
  return db("products")
    .where({ id: Number(id) })
    .first()
}

function deleteById(id) {}

function updateById(id) {}
