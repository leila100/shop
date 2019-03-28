const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")

const mongoConnect = require("./util/database")
const errorController = require("./controllers/error")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

// Middleware to create a user and its corresponding cart
app.use((req, res, next) => {
  // Used to save the current user in req
  // userDb
  //   .findById(2)
  //   .then(user => {
  //     req.user = user
  //     // if user has no cart, create it
  //     cartDb.getCart(user.id).then(cart => {
  //       if (!cart) {
  //         cartDb
  //           .save({ user_id: user.id }) //creating cart for current user
  //           .then(response => {
  //             console.log("Creating a cart for user")
  //           })
  //       }
  //       next()
  //     })
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
})

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin", adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect(client => {
  console.log(client)
  app.listen(3000)
})
