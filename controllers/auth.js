const crypto = require("crypto")

const User = require("../models/user")

const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
// const sendgridTransport = require("nodemailer-sendgrid-transport")
const nodemailerSendgrid = require("nodemailer-sendgrid")
const transporter = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.MAIL_API_KEY
  })
)

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key: process.env.MAIL_API_KEY
//     }
//   })
// )

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

exports.getReset = (req, res, next) => {
  let message = req.flash("error")
  if (message.length > 0) message = message[0]
  else message = null
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      res.redirect("/reset")
    }
    const token = buffer.toString("hex")
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email was found!")
          res.redirect("/reset")
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000 // Now plus 1 hour
        return user.save()
      })
      .then(() => {
        console.log("Sending email to: ", req.body.email, "token: ", token)
        res.redirect("/")
        transporter.sendMail({
          to: req.body.email,
          from: "shop@shopApp.com",
          subject: "Password Reset",
          html: `
          <h2>You requested a password reset.</h2>
          <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password.</p>
          `
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error")
      if (message.length > 0) message = message[0]
      else message = null
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postNewPassword = (req, res, next) => {
  const { userId, password, passwordToken } = req.body
  let resetUser
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user
      return bcrypt.hash(password, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then(() => {
      res.redirect("/login")
    })
    .catch(err => {
      console.log(err)
    })
}
