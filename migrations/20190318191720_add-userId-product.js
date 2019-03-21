exports.up = function(knex, Promise) {
  return knex.schema.table("products", tbl => {
    tbl //create a reference to the user id
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table("products", tbl => {
    tbl.dropColumn("user_id")
  })
}
