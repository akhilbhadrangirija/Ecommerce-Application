const { ObjectId, Collection } = require('mongodb');
var db=require('../configuration/connection')
var collections = require('../configuration/collections')
const bcrypt = require('bcrypt');
const { response } = require('express');
var objectId = require('mongodb').ObjectId

module.exports={

 addUser: async (users,callback)=>{



       var myPlaintextPassword =users.password;

          await bcrypt.hash(myPlaintextPassword, 10,  function(err, hash) {
            users.password=hash;

          // console.log(users);
          db.database().collection(collections.USER_DATA).insertOne(users).then((data)=>{
            // console.log(data);
            })


        });
         

    


 },
 getUser:(userData,callback)=>{

    return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let respose={}
      let user= await db.database().collection(collections.USER_DATA).findOne({email:userData.email})
      if(user){
          // console.log("user here");
          
            bcrypt.compare(userData.password,user.password).then((status)=>{
              if(status){
                  // console.log("login sucess");
                  response.user=user
                  response.status=true
                  resolve(response)
              }else{
                  // console.log("login failed");
                  resolve({status:false})

                  
              }

          })
          
         

      }else{
          console.log("invalid userid or password");
          resolve({status:false})

      }
    })

   

 },
 addToCart:(proId,userId)=>{
      return new Promise(async(resolve,reject)=>{
        let user= await db.database().collection(collections.CART_COLLECTIONS).findOne({user:objectId(userId)})
        if(user){ 
          db.database().collection(collections.CART_COLLECTIONS).updateOne({user:objectId(userId)},
              {
                $push:{products:objectId(proId)}
                
              }).then((response)=>{
                resolve(response)
              })
        }else{
          let cartObj={
            user:objectId(userId),
            products:[objectId(proId)]
          }
          db.database().collection(collections.CART_COLLECTIONS).insertOne(cartObj).then((response)=>{
            resolve(response)
          })


        }
      })

 },
 getCartProducts:(userId)=>{
   return new Promise(async(resolve,reject)=>{
     let cartItems=await db.database().collection(collections.CART_COLLECTIONS).aggregate([
       {
         $match:{user:objectId(userId)}

       },
       {
         $lookup:{
           from:collections.PRODUCT_COLLECTION,
           let:{proList:'$products'},
           pipeline:[
             {
                $match:{
                  $expr:{
                    $in:['$_id',"$$proList"]
                  }
                }
             }
           ],
           as:'cartItems'
         }
       }
     ]).toArray()
     resolve(cartItems)
   })
 },
 deleteCartItem:(productId,userId)=>{
   return new Promise((resolve,reject)=>{
    db.database().collection(collections.CART_COLLECTIONS).updateOne({_id:objectId(userId)},{"$pull":{"products":{_id:objectId(productId)}}}).then((response)=>{
      resolve(response)
    })




//     db.database().collection(collections.CART_COLLECTIONS).deleteOne({_id:objectId(productId)}).then((response)=>{
//       resolve(response)
//       console.log(response);

//  })


   })
 }

}