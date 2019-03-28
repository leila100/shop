const mongodb = require("mongodb")

const MongoClient = mongodb.MongoClient

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://Leila:DgZ2MAckNWKZG3M@cluster0-tfqvb.mongodb.net/test?retryWrites=true"
  )
    .then(client => {
      console.log("CONNECTED!!")
      callback(client)
    })
    .catch(err => console.log(err))
}

module.exports = mongoConnect
