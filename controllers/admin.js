const productDB = require("../data/products/products_db")

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  productDB
    .save(req.body)
    .then(response => {
      res.redirect("/")
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect("/")

  const prodId = req.params.productId
  productDB
    .findById(prodId)
    .then(product => {
      if (!product) return res.redirect("/")

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId
  productDB
    .updateById(prodId, req.body)
    .then(response => {
      res.redirect("/admin/products")
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  productDB
    .fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      })
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.deleteById(prodId)
  res.redirect("/admin/products")
}
