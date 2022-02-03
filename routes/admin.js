var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((productsForDisplay)=>{
    // console.log(productsForDisplay);
  res.render('admin/view-products',{productsForDisplay,admin:true});
    
  })

});
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
   var image = req.files.Image;
   
  productHelper.addProduct(req.body,(id)=>{
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
    res.render("admin/add-product",{admin:true})
      }else{
        console.log(err);
      // res.render("admin/add-product")

      }
      
    })
  })
})

router.post('/delete-product/:id',(req,res)=>{
  let productId=req.params.id
  // console.log(productId);
  productHelper.deleteProduct(productId).then((response)=>{
    res.redirect('/admin')
  })


})
router.get('/edit-product/:id',(req,res)=>{
  let productId=req.params.id

  productHelper.getOneProducts(productId).then((response)=>{
    // console.log(response._id);

  res.render('admin/edit-product',{response})



  })


  
})
router.post('/view-products',(req,res)=>{


  productHelper.editProduct(req.body).then((response)=>{
    res.redirect('/admin')
  })
})

module.exports = router;
