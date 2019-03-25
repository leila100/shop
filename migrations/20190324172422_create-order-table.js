exports.up = function(knex, Promise) {
  return knex.schema.createTable("orders", function(tbl) {
    tbl.increments() // pass the name if you wanted to be called anything other than id
    tbl //create a reference to the user id
      .integer("user_id")
      .notNullable()
      .unsigned()
      .unique()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
    tbl.integer("Total").notNullable()
    tbl.timestamp("createdAt").defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("orders")
}
