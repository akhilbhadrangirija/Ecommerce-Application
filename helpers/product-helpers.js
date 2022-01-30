var db=require('../configuration/connection')
module.exports={
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('products').insertOne(product).then((data)=>{
            console.log(data);
        callback(data)
        })
    }
}