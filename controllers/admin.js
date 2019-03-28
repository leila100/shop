const productDB = require("../data/products/products_db")
const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body
  const product = new Product(title, price, description, imageUrl)
  product
    .save()
    .then(response => {
      res.redirect("/admin/products")
    })
    .catch(err => console.log(err))
}

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit
//   if (!editMode) return res.redirect("/")

//   const prodId = req.params.productId
//   productDB
//     .findById(prodId)
//     .then(product => {
//       if (!product) return res.redirect("/")

//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.params.productId
//   productDB
//     .updateById(prodId, req.body)
//     .then(response => {
//       res.redirect("/admin/products")
//     })
//     .catch(err => console.log(err))
// }

// exports.getProducts = (req, res, next) => {
//   productDB
//     .fetchAll(req.user.id)
//     .then(products => {
//       console.log("products: ", products, req.user.id)
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products"
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.params.productId
//   productDB
//     .deleteById(prodId)
//     .then(response => {
//       res.redirect("/admin/products")
//     })
//     .catch(err => console.log(err))
// }
