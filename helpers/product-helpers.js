const { ObjectId, Collection } = require('mongodb');
var db=require('../configuration/connection')
var collections = require('../configuration/collections')
module.exports={
    addProduct:(product,callback)=>{
        db.database().collection('products').insertOne(product).then((data)=>{
        callback(data.insertedId)
        })
    },
     getAllProducts:()=>{
        return new Promise (async(resolve,reject)=>{
            let productsForDisplay = await db.database().collection(collections.PRODUCT_COLLECTION).find().toArray()
            // console.log(productsForDisplay)
            resolve(productsForDisplay)
        })
    }
}