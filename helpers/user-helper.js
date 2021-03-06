const { ObjectId, Collection } = require('mongodb');
var db=require('../configuration/connection')
var collections = require('../configuration/collections')
const bcrypt = require('bcrypt');
const { response } = require('express');
const { reject } = require('bcrypt/promises');
const async = require('hbs/lib/async');
var objectId = require('mongodb').ObjectId
var Razorpay=require('razorpay')
var crypto = require('crypto');
var instance = new Razorpay({
  key_id: 'rzp_test_o2RcHETnkKD3uk',
  key_secret: 'a4o8rydUgGraqkBeQCpZDkn4',
});

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
   let proObj={
     item:objectId(proId),
     quantity:1

   }
      return new Promise(async(resolve,reject)=>{
        let userCart= await db.database().collection(collections.CART_COLLECTIONS).findOne({user:objectId(userId)})
        if(userCart){ 
          // console.log(userCart);
          let proExist=userCart.products.findIndex(product=> product.item==proId)
          console.log(proExist)
          if(proExist!=-1){
            db.database().collection(collections.CART_COLLECTIONS).updateOne({user:objectId(userId),'products.item':objectId(proId)},
            {
              $inc:{'products.$.quantity':1}
            }
            ).then((response)=>{
              resolve()
            })
           
          }else{
            db.database().collection(collections.CART_COLLECTIONS).updateOne({user:objectId(userId)},
              {
                $push:{products:proObj}
                
              }).then((response)=>{
                resolve(response)
              })
          }

          
        }else{
          let cartObj={
            user:objectId(userId),
            products:[proObj]
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
         $unwind:'$products'
       },
       {
         $project:{
           item:'$products.item',
           quantity:'$products.quantity'
         }
       },{
         $lookup:{
           from:collections.PRODUCT_COLLECTION,
           localField:'item',
           foreignField:'_id',
           as:'products'
         }
       },
       {
         $project:{
           item:1,quantity:1,product:{$arrayElemAt:['$products',0]}
         }
       }

     
     ]).toArray()
    //  console.log(cartItems);
     resolve(cartItems)
   })
 },
 getCartCount:(userId)=>{
   return new Promise(async (resolve,reject)=>{
     let count=0
     let cart=await db.database().collection(collections.CART_COLLECTIONS).findOne({user:objectId(userId)})
     if(cart){
       count=cart.products.length
       
     }
     resolve(count)

   })
 },
 changeProductQuantity:(details)=>{
  //  console.log(details.count);
  details.quantity=parseInt(details.quantity)
  details.count=parseInt(details.count)
  // console.log(details.count);
  // console.log(details.quantity);

   return new Promise((resolve,reject)=>{
     if(details.count==-1&&details.quantity==1){
      db.database().collection(collections.CART_COLLECTIONS).updateOne({_id:objectId(details.cart)},
      {
        $pull:{products:{item:objectId(details.product)}}
      }
      ).then((response)=>{
        resolve({removeProduct:true})
      })

     }else if(details.count==(-details.quantity)){db.database().collection(collections.CART_COLLECTIONS).updateOne({_id:objectId(details.cart)},
     {
       $pull:{products:{item:objectId(details.product)}}
     }
     ).then((response)=>{
       resolve({removeProduct:true})
     })

     }
     
     else{
      db.database().collection(collections.CART_COLLECTIONS).updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
      {
        $inc:{'products.$.quantity':details.count}
      }
      ).then((response)=>{
        resolve({status:true})
      })

     }
    

   })
 },
 getTotalAmount:(userId)=>{
  return new Promise(async(resolve,reject)=>{
    let cartItem=db.database().collection(collections.CART_COLLECTIONS).find({user:objectId(userId)})
    // console.log(cartItem);
    
      let total=await db.database().collection(collections.CART_COLLECTIONS).aggregate([
        {
          $match:{user:objectId(userId)}
  
        },
        {
          $unwind:'$products'
        },
        {
          $project:{
            item:'$products.item',
            quantity:'$products.quantity'
          }
        },{
          $lookup:{
            from:collections.PRODUCT_COLLECTION,
            localField:'item',
            foreignField:'_id',
            as:'products'
          }
        },
        {
          $project:{
            item:1,quantity:1,product:{$arrayElemAt:['$products',0]}
          }
        }
        ,
        {
          $group:{
            _id:null,
            total:{$sum:{$multiply:['$quantity','$product.Price']}}
          }
        }
  
      
      ]).toArray()
      // console.log(total[0].total);
      resolve(total[0].total)

    
   
  })

 },
 getCartProductList:(userId)=>{
   return new Promise(async(resolve,reject)=>{
     let cart=await db.database().collection(collections.CART_COLLECTIONS).findOne({user:objectId(userId)})
   resolve(cart.products)
    })
 },
 placeOrder:(details,products,total)=>{
   return new Promise((resolve,reject)=>{
     let status=details.payment==='cod'?'placed':'pending'
     let orderObj={
       deldetails:{
         mobile:details.mobile,
         address:details.address,
         pin:details.zip

       },
       userId:objectId(details.userId),
       paymentmethod:details.payment,
       products:products,
       status:status,
       total:total,
       date:new Date()

     }
    //  console.log(orderObj);
    
     db.database().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
       
       db.database().collection(collections.CART_COLLECTIONS).drop({user:objectId(details.userId)})
      //  console.log(response.insertedId);
       resolve(response.insertedId)
     })
   })
 },
 getOrders:(userId)=>{
   
   return new Promise(async(resolve,reject)=>{
    let order=await db.database().collection(collections.ORDER_COLLECTION).find({userId:objectId(userId)}).toArray()
  resolve(order)
   })
  
    
  
 },
 getOrderProducts:(orderId)=>{
  return new Promise(async(resolve,reject)=>{
    let orderItems=await db.database().collection(collections.ORDER_COLLECTION).aggregate([
      {
        $match:{_id:objectId(orderId)}

      },
      {
        $unwind:'$products'
      },
      {
        $project:{
          item:'$products.item',
          quantity:'$products.quantity'
        }
      },{
        $lookup:{
          from:collections.PRODUCT_COLLECTION,
          localField:'item',
          foreignField:'_id',
          as:'products'
        }
      },
      {
        $project:{
          item:1,quantity:1,product:{$arrayElemAt:['$products',0]}
        }
      }

    
    ]).toArray()
    // console.log(orderItems)
    resolve(orderItems)
  })

 },
 generateRazorpay:(orederId,total)=>{
   return new Promise((resolve,reject)=>{

    var options = {
      amount: total,  // amount in the smallest currency unit
      currency: "INR",
      receipt: ""+orederId
    };
    instance.orders.create(options, function(err, order) {
      console.log("new order:",order);
      resolve(order)
    });

   })
 },
 verifyPayment:(details)=>{
   return new Promise((resolve,reject)=>{
     var hmac = crypto.createHmac('sha256', 'a4o8rydUgGraqkBeQCpZDkn4');
     hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
     hmac= hmac.digest('hex')
     if(hmac==details['payment[razorpay_signature]']){
      //  console.log("verified");
     resolve()

     }else{
       reject()
     }
   })

 },
 changePaymentStatus:(orderId)=>{

  return new Promise((resolve,reject)=>{
    db.database().collection(collections.ORDER_COLLECTION)
    .updateOne({_id:objectId(orderId)},{
      $set:{
        status:'placed'}

    }).then(()=>{
      resolve()
    })
   
  })

 }

}