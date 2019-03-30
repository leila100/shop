const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const errorController = require("./controllers/error")
const User = require("./models/user")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

// Middleware to create a user and its corresponding cart
app.use((req, res, next) => {
  // Used to save the current user in req
  User.findById("5c9fe9f430e68927d8fc94e8")
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

mongoose
  .connect(
    "mongodb+srv://Leila:DgZ2MAckNWKZG3M@cluster0-tfqvb.mongodb.net/shop?retryWrites=true"
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Leila",
          email: "Leila@test.com",
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(3000)
  })
  .catch(err => console.log(err))
