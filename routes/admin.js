const express = require("express")
const { body } = require("express-validator/check")

const adminController = require("../controllers/admin")
const isAuth = require("../middleware/is-auth")

const router = express.Router()

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct)

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts)

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct)

router.post(
  "/edit-product/:productId",
  [
    body(
      "title",
      "Please enter an alphanumeric title of at least 3 characters long."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl", "Please enter a valid URL")
      .isURL()
      .trim(),
    body("price", "Please enter price in the format x.xx").isFloat(),
    body(
      "description",
      "Please enter a description of at least 5 characters and no more than 400"
    )
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
)

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage(
        "Please enter an alphanumeric title of at least 3 characters long."
      ),
    body("imageUrl", "Please enter a valid URL")
      .isURL()
      .trim(),
    body("price", "Please enter price in the format x.xx").isFloat(),
    body(
      "description",
      "Please enter a description of at least 5 characters and no more than 400"
    )
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
)

router.post(
  "/delete-product/:productId",
  isAuth,
  adminController.postDeleteProduct
)

module.exports = router
