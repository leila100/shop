exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { name: "Leila", email: "leila@leila.com" },
        { name: "Anissa", email: "anissa@anissa.com" },
        { name: "Aida", email: "aida@aida.com" },
        { name: "Kenza", email: "kenza@kenza.com" }
      ])
    })
}
