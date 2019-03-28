const mongodb = require("mongodb")

const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://Leila:DgZ2MAckNWKZG3M@cluster0-tfqvb.mongodb.net/shop?retryWrites=true"
  )
    .then(client => {
      console.log("CONNECTED TO DATABASE!!")
      _db = client.db()
      callback()
    })
    .catch(err => {
      throw err
      console.log(err)
    })
}

const getDb = () => {
  if (_db) return _db
  throw "No database found!"
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
