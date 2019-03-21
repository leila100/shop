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

function save(user) {
  return db("users").insert(user)
}

function fetchAll() {
  return db("users")
}

function findById(id) {
  return db("users")
    .where({ id: Number(id) })
    .first()
}

function deleteById(id) {
  return db("users")
    .where({ id: Number(id) })
    .del()
}

function updateById(id, user) {
  const { title, imageUrl, price, description } = user
  return db("users")
    .where({ id: Number(id) })
    .update({ title, imageUrl, price, description })
}
