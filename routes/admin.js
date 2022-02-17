var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helper')

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
   req.body.Price=parseInt(req.body.Price)
  //  console.log(req.body);
   
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


// ///////////////////////////////////////////////////////////////////////////////////

router.get('/signup',(req,res)=>{
  res.render('admin/signup')
});

router.post('/signup',(req,res)=>{

  userHelpers.addAdmin(req.body).then((response)=>{
    req.session.user=response
    // req.session.user.loggedIn=true
    res.redirect('/')

    
  })


});

router.get('/login',(req,res)=>{
  if(req.session.admin){
    res.redirect('/')
  }else{
  res.render('admin/login',{loginErr:req.session.adminLoginErr})
  req.session.adminLoginErr=false
  }
});
router.post('/login',(req,res)=>{
  userHelpers.getAdmin(req.body).then((respones)=>{
    if(respones.status){
      req.session.admin=response.admin
      // req.session.admin.loggedIn=true
      res.redirect('/')
    }else{
      req.session.adminLoginErr=true
      res.redirect('/login')
    }
  })
});

////////////////////////////////////////////////////////////////////////////////

router.get('/delete-product/:id',(req,res)=>{
  let productId=req.params.id
  // console.log(productId);
  productHelper.deleteProduct(productId).then((response)=>{
    res.redirect('/admin')
  })
})
router.get('/edit-product/:id',async(req,res)=>{
  let productId=req.params.id
  let product= await productHelper.getProductdetails(productId)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  req.body.Price=parseInt(req.body.Price)
  productHelper.updateProduct(id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')

    }
  })
})
module.exports = router;
