const express = require("express")
const { check, body } = require("express-validator/check")
const authController = require("../controllers/auth")

const router = express.Router()

const User = require("../models/user")

router.get("/login", authController.getLogin)

router.post("/login", authController.postLogin)

router.post("/logout", authController.postLogout)

router.get("/signup", authController.getSignup)

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is not a valid email address.")
        // } else return true
        return User.findOne({ email: value }).then(userData => {
          if (userData) {
            return Promise.reject(
              "Email exists already, please pick a different one."
            )
          }
        })
      }),
    body(
      "password",
      "Please enter a password with only numbers and lettersand at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The passwords have to match!")
      } else return true
    })
  ],
  authController.postSignup
)

router.get("/reset", authController.getReset)

router.post("/reset", authController.postReset)

router.get("/reset/:token", authController.getNewPassword)

router.post("/new-password", authController.postNewPassword)

module.exports = router
