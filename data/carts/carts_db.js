const knex = require("knex")
const knexConfig = require("../../knexfile")

const db = knex(knexConfig.development)

module.exports = {
  save,
  getCart
}

function save(id) {
  return db("carts").insert(id)
}

function getCart(id) {
  return db("carts")
    .where({ user_id: id })
    .first()
}
