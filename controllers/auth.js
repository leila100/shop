const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")

const User = require("../models/user")

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
)

exports.getLogin = (req, res, next) => {
  let message = req.flash("error")
  if (message.length > 0) message = message[0]
  else message = null
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password.")
        return res.redirect("/login")
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user
            req.session.isLoggedIn = true
            //To be sure the session finished being stored in db, before redirecting
            return req.session.save(err => {
              console.log(err)
              res.redirect("/")
            })
          }
          req.flash("error", "Invalid email or password.")
          res.redirect("/login")
        })
        .catch(err => {
          console.log(err)
          res.redirect("/login")
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect("/")
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash("error")
  if (message.length > 0) message = message[0]
  else message = null
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email: email })
    .then(userData => {
      if (userData) {
        req.flash("error", "Email exists already, please pick a different one.")
        return res.redirect("/signup")
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return user.save()
        })
        .then(() => {
          res.redirect("/login")
          transporter.sendMail({
            to: email,
            from: "shop@shop.com",
            subject: "Signup Successful",
            html: "<h1>You have successfully signed up!</h1>"
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}
