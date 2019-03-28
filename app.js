const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")

const mongoConnect = require("./util/database").mongoConnect
const errorController = require("./controllers/error")
const User = require("./models/user")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

// Middleware to create a user and its corresponding cart
app.use((req, res, next) => {
  // Used to save the current user in req
  User.findById("5c9d51e809fe2206b492a2d4")
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect(() => {
  app.listen(3000)
})
