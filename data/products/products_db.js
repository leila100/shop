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

function fetchAll(userId) {
  if (userId) return db("products").where({ user_id: Number(userId) })
  else return db("products")
}

function findById(id) {
  return db("products")
    .where({ id: Number(id) })
    .first()
}

function deleteById(id) {
  return db("products")
    .where({ id: Number(id) })
    .del()
}

function updateById(id, product) {
  const { title, imageUrl, price, description } = product
  return db("products")
    .where({ id: Number(id) })
    .update({ title, imageUrl, price, description })
}
