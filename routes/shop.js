const path = require("path")

const express = require("express")

const shopController = require("../controllers/shop")

const router = express.Router()

router.get("/", shopController.getIndex)

router.get("/products", shopController.getProducts)

// router.get("/products/:productId", shopController.getProduct)

// router.get("/cart", shopController.getCart)

// router.post("/cart", shopController.postCart)

// router.post(
//   "/cart-delete-item/:productId",
//   shopController.postCartDeleteProduct
// )

// router.post("/create-order", shopController.postOrder)

// router.get("/orders/:id", shopController.getOrder)

// router.get("/orders", shopController.getOrders)

module.exports = router
