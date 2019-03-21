const path = require("path")

const express = require("express")
const bodyParser = require("body-parser")

const errorController = require("./controllers/error")

const userDb = require("./data/users/users_db")

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use((req, res, next) => {
  // Used to save the current user in req
  userDb
    .findById(1)
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

app.listen(3000)
