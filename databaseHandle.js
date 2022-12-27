var mongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://thinhnt:tienthinh1602@cluster0.oiwaovd.mongodb.net/test'
const { ObjectId } = require('bson')

async function getDB() {
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1002")
    return db
}

async function insertProduct(newProduct) {
    let db = await getDB()
    let id = await db.collection("products").insertOne(newProduct)
    return id
}

async function viewAllProduct() {
    let db = await getDB()
    let results = await db.collection("products").find().toArray()
    return results
}

async function deleteProduct(id) {
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1002")
    await db.collection("products").deleteOne({ _id: ObjectId(id) })
}

async function searchProductByName(name){
    let db = await getDB()
    const results = await db.collection("products").find({ name: new  RegExp(name)  }).toArray()
    return results
}


module.exports = {insertProduct, viewAllProduct, deleteProduct, searchProductByName}