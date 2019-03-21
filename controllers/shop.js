const productDB = require("../data/products/products_db")
const Cart = require("../models/cart")

exports.getProducts = (req, res, next) => {
  productDB
    .fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  productDB
    .findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        path: "/products",
        pageTitle: product.title,
        product: product
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  productDB
    .fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    productDB
      .fetchAll()
      .then(products => {
        const cartProducts = []
        for (product of products) {
          const cartProductData = cart.products.find(
            prod => prod.id === product.id
          )
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty
            })
          }
        }
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts
        })
      })
      .catch(err => console.log(err))
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect("/cart")
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect("/cart")
  })
}

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders"
  })
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  })
}