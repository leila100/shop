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
            products: products
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
      cartDB
        .getProducts(cart.id)
        .then(products => {
          const product = products.find(p => p.id === Number(prodId))
          // Check if product already in cart,
          if (product) {
            //if yes, update quantity
            cartDB
              .updateProduct(prodId, cart.id, product.quantity + 1)
              .then(count => res.redirect("/cart"))
              .catch(err => console.log(err))
          } else {
            // If no, add product to cart
            productDB.findById(prodId).then(p => {
              cartDB
                .addProduct(prodId, cart.id)
                .then(count => res.redirect("/cart"))
                .catch(err => console.log(err))
            })
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
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
