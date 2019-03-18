exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("products")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("products").insert([
        {
          title: "Watch",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/image/AppleInc/aos/published/images/M/TQ/MTQU2/MTQU2_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1535672689114",
          description: "This is a very good looking watch!",
          price: 255.99
        },
        {
          title: "Phone",
          imageUrl:
            "https://fortunedotcom.files.wordpress.com/2018/04/iphone8_iphone8plus_product_red_front_back_041018-e1523280198726.jpg",
          description: "This is a nice phone!",
          price: 400
        },
        {
          title: "Cleaner",
          imageUrl:
            "https://methodhome.com/wp-content/uploads/apc_p-1-500x500.png",
          description: "This cleaner really works!",
          price: 12.99
        }
      ])
    })
}
