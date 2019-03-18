exports.up = function(knex, Promise) {
  return knex.schema.createTable("products", function(tbl) {
    // we must use the callback syntax for .createTable()
    tbl.increments() // pass the name if you wanted to be called anything other than id
    tbl
      .string("title", 255)
      .notNullable()
      .unique("uq_product_title")
    tbl.double("price").notNullable()
    tbl.text("description").notNullable()
    tbl.string("imageUrl", 255).notNullable()
    tbl.timestamp("createdAt").defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("products")
}
