const mongoose = require("mongoose")

const { validationResult } = require("express-validator/check")

const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    validationErrors: [],
    errorMessage: null
  })
}

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, price, description },
      hasError: true,
      validationErrors: errors.array()
    })
  }

  const product = new Product({
    _id: mongoose.Types.ObjectId("5ca6abc7280dc72ab839818b"),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user //mongoose will only store user._id
  })
  product
    .save()
    .then(response => {
      res.redirect("/admin/products")
    })
    .catch(err => {
      console.log("An error occurred!!")
      res.redirect("/500")
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) return res.redirect("/")

  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      if (!product) return res.redirect("/")

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId
  const { title, imageUrl, price, description } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: errors.array()[0].msg,
      product: { title, imageUrl, price, description, _id: prodId },
      hasError: true,
      validationErrors: errors.array()
    })
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/") //User doesn't have the right to edit product
      }
      product.title = title
      product.imageUrl = imageUrl
      product.price = price
      product.description = description
      return product.save().then(response => {
        res.redirect("/admin/products")
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // can add: .select('title price -_id) can select just title and price, remove id
    //.populate('userId', 'name') this add name (remove name for all the information) about the user to the response - no just id
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
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products")
    })
    .catch(err => console.log(err))
}
