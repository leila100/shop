exports.up = function(knex, Promise) {
  return knex.schema.createTable("carts", function(tbl) {
    tbl.increments() // pass the name if you wanted to be called anything other than id
    tbl //create a reference to the user id
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
    tbl.timestamp("createdAt").defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("carts")
}
