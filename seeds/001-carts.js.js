exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("carts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("table_name").insert([{ user_id: 1 }])
    })
}
