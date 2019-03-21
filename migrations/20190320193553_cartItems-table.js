exports.up = function(knex, Promise) {
  return knex.schema.createTable("cartItems", function(tbl) {
    tbl.increments() // pass the name if you wanted to be called anything other than id
    tbl.integer("quantity").notNullable()
    tbl //create a reference to the user id
      .integer("cart_id")
      .unsigned()
      .references("id")
      .inTable("carts")
      .onUpdate("CASCADE")
    tbl //create a reference to the user id
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("productss")
      .onUpdate("CASCADE")
    tbl.timestamp("createdAt").defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("cartItems")
}
