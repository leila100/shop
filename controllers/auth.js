const User = require("../models/user")

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postLogin = (req, res, next) => {
  User.findById("5c9fe9f430e68927d8fc94e8")
    .then(user => {
      req.session.user = user
      req.session.isLoggedIn = true
      //To be sure the session finished being stored in db, before redirecting
      req.session.save(err => {
        console.log(err)
        res.redirect("/")
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
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  })
}

exports.postSignup = (req, res, next) => {}
