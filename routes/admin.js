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
module.exports = router;
