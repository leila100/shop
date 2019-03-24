const productDB = require("../data/products/products_db")
const cartDB = require("../data/carts/carts_db")

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
  cartDB
    .getCart(req.user.id)
    .then(cart => {
      cartDB
        .getProducts(cart.id)
        .then(products => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
            total: cart.total_price
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  cartDB
    .getCart(req.user.id)
    .then(cart => {
      cartDB.getProduct(cart.id, prodId).then(product => {
        // Check if product already in cart,
        if (product) {
          //if yes, update quantity
          cartDB
            .updateProduct(prodId, cart.id, product.quantity + 1)
            .then(count => {
              //Update the cart total price
              const total = cart.total_price + product.price
              cartDB
                .updateTotalPrice(total, cart.id)
                .then(count => res.redirect("/cart"))
                .catch(err => console.log(err))
            })
        } else {
          // If no, add product to cart
          productDB.findById(prodId).then(p => {
            cartDB.addProduct(prodId, cart.id).then(count => {
              productDB.findById(prodId).then(prod => {
                const total = cart.total_price + prod.price
                cartDB
                  .updateTotalPrice(total, cart.id)
                  .then(count => res.redirect("/cart"))
              })
            })
          })
        }
      })
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  cartDB
    .getCart(req.user.id)
    .then(cart => {
      cartDB.getProduct(cart.id, prodId).then(product => {
        // Check if product already in cart,
        if (product) {
          if (product.quantity === 1) {
            cartDB.removeProduct(cart.id, prodId).then(count => {
              console.log(count)
            })
          } else {
            cartDB
              .updateProduct(prodId, cart.id, product.quantity - 1)
              .then(count => {
                console.log(count)
              })
          }
          const total = cart.total_price - product.price
          cartDB
            .updateTotalPrice(total, cart.id)
            .then(count => res.redirect("/cart"))
        } else res.redirect("/cart")
      })
    })
    .catch(err => console.log(err))
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
