const { ObjectId, Collection } = require('mongodb');
var db=require('../configuration/connection')
var collections = require('../configuration/collections')
var objectId = require('mongodb').ObjectId;
const { promise } = require('bcrypt/promises');
const { response } = require('express');
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
    },
    deleteProduct:(productId)=>{
        return new Promise ((resolve,reject)=>{
            console.log(productId);
             db.database().collection(collections.PRODUCT_COLLECTION).deleteOne({_id:objectId(productId)}).then((response)=>{
                 resolve(response)

            })
            // console.log(productsForDisplay)
        })
        

    },
    getOneProducts:(productId)=>{
        // console.log(productId);
        return new Promise ((resolve,reject)=>{
             db.database().collection(collections.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((response)=>{
            resolve(response)
            //  console.log(response);
             })
        })
    },
    
    editProduct:(newData)=>{

        console.log(newData.Name);
        return new Promise ((resolve,reject)=>{
            var myquery ={Name:newData.Name}     


            var newvalues = { $set: { Name: newData.Name, Category: newData.Category,Price:newData.Price,Description:newData.Description } };

            db.database().collection(collections.PRODUCT_COLLECTION).updateOne(myquery, newvalues).then((response,err)=> {
                if (err) throw err;
                console.log("1 document updated");
                resolve(response)
              })
            })
            

        
    }
}