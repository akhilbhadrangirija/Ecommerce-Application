const { ObjectId, Collection } = require('mongodb');
var db=require('../configuration/connection')
var collections = require('../configuration/collections')
const bcrypt = require('bcrypt');
const { response } = require('express');
module.exports={

 addUser: async (users,callback)=>{



       var myPlaintextPassword =users.password;

          await bcrypt.hash(myPlaintextPassword, 10,  function(err, hash) {
            users.password=hash;

          console.log(users.password);
          db.database().collection(collections.USER_DATA).insertOne(users).then((data)=>{
            console.log(data);
            })


        });
         

    


 },
 getUser:(userData,callback)=>{

    return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let respose={}
      let user= await db.database().collection(collections.USER_DATA).findOne({email:userData.email})
      if(user){
          console.log("user here");
          
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

   

 }

}