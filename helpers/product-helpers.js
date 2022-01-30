const { ObjectId } = require('mongodb');
var db=require('../configuration/connection')
module.exports={
    addProduct:(product,callback)=>{
        db.database().collection('products').insertOne(product).then((data)=>{
        callback(data.insertedId)
        })
    }
}