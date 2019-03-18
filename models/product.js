const Cart = require("./cart")

const db = require("../util/database")

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    return db("products").insert(this)
  }

  static fetchAll() {
    return db("products")
  }

  static findById(id, cb) {}

  static deleteById(id) {}
}
