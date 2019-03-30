const Product = require("../models/product")

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.findById(prodId)
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
  Product.fetchAll()
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
  req.user
    .getCart()
    .then(products => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products
      })
    })
    .catch(err => console.log(err))
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
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  req.user
    .removeFromCart(prodId)
    .then(count => res.redirect("/cart"))
    .catch(err => console.log(err))
}

// exports.postOrder = (req, res, next) => {
//   cartDB
//     .getCart(req.user.id)
//     .then(cart => {
//       orderDB.createOrder(req.user.id, cart.total_price).then(orderId => {
//         cartDB.getProducts(cart.id).then(products => {
//           products.forEach(prod => {
//             orderDB
//               .saveOrderItem(prod.id, orderId.id, prod.quantity)
//               .then(orderItemId => console.log("orderItem: ", orderItemId))
//           })
//           //Clear cart and redirect to /order
//           cartDB.emptyCart(cart.id).then(count =>
//             cartDB.resetTotal(cart.id).then(id => {
//               res.render("shop/order", {
//                 path: `/order/${orderId.id}`,
//                 pageTitle: "Your Order",
//                 products: products,
//                 total: cart.total_price
//               })
//             })
//           )
//         })
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.getOrder = (req, res, next) => {
//   orderDB
//     .getProducts(req.params.id)
//     .then(products => {
//       if (products.length > 0) {
//         res.render("shop/order", {
//           path: `/order/${req.params.id}`,
//           pageTitle: "Your Order",
//           products: products,
//           total: products[0].Total
//         })
//       } else res.redirect("/orders")
//     })
//     .catch(err => console.log(err))
// }

// exports.getOrders = (req, res, next) => {
//   orderDB.getOrders(req.user.id).then(result => {
//     orderDB.getOrderIds(req.user.id).then(ids => {
//       const orders = []
//       ids.forEach(orderId => {
//         const order = { orderId: orderId.id, products: [] }
//         const products = result.filter(res => res.orderId === orderId.id)
//         order.products = products
//         orders.push(order)
//       })
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Orders",
//         orders: orders
//       })
//     })
//   })
// }
