const { response } = require('express');
var express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const async = require('hbs/lib/async');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helper')

// Checking login status

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}



/* GET home page. */
router.get('/', async function(req, res, next) {

let user=req.session.user

// console.log(user._id);
let cartCount=null
if(user){
         cartCount= await userHelpers.getCartCount(user._id)
       
}
// console.log(cartCount);
  productHelper.getAllProducts().then((productsForDisplay)=>{
    res.render('user/index',{productsForDisplay,user,cartCount})
  })
 
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('user/login',{loginErr:req.session.loginErr})
  req.session.loginErr=false
  }
});
router.get('/signup',(req,res)=>{
  res.render('user/signup')
});

router.post('/signup',(req,res)=>{

  userHelpers.addUser(req.body).then((response)=>{
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')

    
  })


});
router.post('/login',(req,res)=>{
  userHelpers.getUser(req.body).then((respones)=>{
    if(respones.status){
      // console.log("login sucess");
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr=true
      // console.log("login failed");
      res.redirect('/login')
    }
  })
});
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
    
})
router.get('/cart',verifyLogin,async(req,res)=>{
 
  let products=await userHelpers.getCartProducts(req.session.user._id)
   let cartItem=products[0].cartItems
   console.log(cartItem.length);
  //  console.log(cartItem);
    res.render('user/cart',{cartItem,user:req.session.user})

 
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  
  //  console.log(req.params.id);
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{

    res.redirect('/')

  })
  

 
})







module.exports = router;
