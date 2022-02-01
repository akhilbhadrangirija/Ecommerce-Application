const { response } = require('express');
var express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helper')

/* GET home page. */
router.get('/', function(req, res, next) {

let user=req.session.user
console.log(user);
  productHelper.getAllProducts().then((productsForDisplay)=>{
    res.render('user/index',{productsForDisplay,user})
  })
 
});
router.get('/login',(req,res)=>{
  res.render('user/login')
});
router.get('/signup',(req,res)=>{
  res.render('user/signup')
});

router.post('/signup',(req,res)=>{

  userHelpers.addUser(req.body,()=>{
    
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
      // console.log("login failed");
      res.redirect('/login')
    }
  })
});
router.get('/logout',(req,res)=>{
    res.session.destroy()
    res.redirect('/')
    
})







module.exports = router;
