exports.up = function(knex, Promise) {
  return knex.schema.createTable("orderItems", function(tbl) {
    tbl.increments() // pass the name if you wanted to be called anything other than id
    tbl.integer("quantity").notNullable()
    tbl //create a reference to the user id
      .integer("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onUpdate("CASCADE")
    tbl //create a reference to the user id
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onUpdate("CASCADE")
    tbl.timestamp("createdAt").defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("orderItems")
}
