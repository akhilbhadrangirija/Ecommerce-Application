const { ObjectId, Collection } = require('mongodb');
var db=require('../configuration/connection')
var collections = require('../configuration/collections')
var objectId = require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
        // console.log(product);
        db.database().collection('products').insertOne(product).then((data)=>{
        callback(data.insertedId)
        // console.log(data);
        })
    },
     getAllProducts:()=>{
        return new Promise (async(resolve,reject)=>{
            let productsForDisplay = await db.database().collection(collections.PRODUCT_COLLECTION).find().toArray()
            // console.log(productsForDisplay)
            resolve(productsForDisplay)
        })
    },
    deleteProduct:(productId)=>{
        return new Promise ((resolve,reject)=>{
            // console.log(productId);
             db.database().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:objectId(productId)}).then((response)=>{
                 resolve(response)

            })
            // console.log(productsForDisplay)
        })
        

    },
    getProductdetails:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.database().collection(collections.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((response)=>{
                resolve(response)

           })

        })
    },
    updateProduct:(productId,productDetails)=>{
        return new Promise((resolve,reject)=>{
            var newvalues = { $set: {Name:productDetails.Name, Category: productDetails.Category,Description: productDetails.Description,Price: productDetails.Price, } };

            db.database().collection(collections.PRODUCT_COLLECTION).updateOne({_id:objectId(productId)},newvalues).then((response)=>{
                resolve(response)
            })
        })
    }
}