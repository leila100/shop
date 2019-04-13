const fs = require("fs")
const path = require("path")
const PDFDocument = require("pdfkit")

const Product = require("../models/product")
const Order = require("../models/order")

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        path: "/products",
        pageTitle: product.title,
        product: product
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect("/cart")
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  req.user
    .removeFromCart(prodId)
    .then(count => res.redirect("/cart"))
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc }
        }
      })
      const order = new Order({
        user: {
          email: req.session.user.email,
          userId: req.session.user
        },
        products: products
      })
      order.save()
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(() => res.redirect("/orders"))
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id }).then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders
    })
  })
}

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params
  Order.findById(orderId)
    .then(order => {
      if (!order) return next(new Error("No order found!"))
      if (order.user.userId.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized"))
      const invoiceName = "invoice-" + orderId + ".pdf"
      const invoicePath = path.join("data", "invoices", invoiceName)

      const pdfDoc = new PDFDocument()
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      )
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true
      })
      pdfDoc.text("--------------------------------")
      let totalPrice = 0
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
          )
      })
      pdfDoc.text("---------------------")
      pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`)
      pdfDoc.end()
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
