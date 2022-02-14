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
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}



/* GET home page. */
router.get('/', async function(req, res, next) {

let user=req.session.user

let cartCount=null
if(user){
         cartCount= await userHelpers.getCartCount(user._id)
       
}
  productHelper.getAllProducts().then((productsForDisplay)=>{
    res.render('user/index',{productsForDisplay,user,cartCount})
  })
 
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
  res.render('user/login',{loginErr:req.session.userLoginErr})
  req.session.userLoginErr=false
  }
});
router.get('/signup',(req,res)=>{
  res.render('user/signup')
});

router.post('/signup',(req,res)=>{

  userHelpers.addUser(req.body).then((response)=>{
    req.session.user=response
    req.session.user.loggedIn=true
    res.redirect('/')

    
  })


});
router.post('/login',(req,res)=>{
  userHelpers.getUser(req.body).then((respones)=>{
    if(respones.status){
      req.session.user=response.user
      req.session.user.loggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr=true
      res.redirect('/login')
    }
  })
});
router.get('/logout',(req,res)=>{
    req.session.user=null
    res.redirect('/')
    
})
router.get('/cart',verifyLogin,async(req,res)=>{

  

  let products=await userHelpers.getCartProducts(req.session.user._id)
  let totalValue=0
  if(products.length>0){
    totalValue=await userHelpers.getTotalAmount(req.session.user._id)

  }

   

    let user=req.session.user
    res.render('user/cart',{products,user,totalValue})

 
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then((response)=>{

    res.json({status:true})


  })
  

 
})
router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total =await userHelpers.getTotalAmount(req.body.user)

    res.json(response)


  })
})
router.get('/place-order',verifyLogin,async (req,res)=>{
  let user=req.session.user
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user})
})


router.post('/place-order',async(req,res)=>{
  let products= await userHelpers.getCartProductList(req.body.userId)
   total= await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,total).then((orderId)=>{
    // console.log(response);
    if(req.body.payment==='online'){
      userHelpers.generateRazorpay(orderId,total).then((response)=>{
        res.json(response)

      })

    }else{
      res.json({paymentsucess:true})
    }
    

  })
  
})
router.get('/order-success',(req,res)=>{

  res.render('user/order-success',{user:req.session.user})
})
router.get('/orders',async (req,res)=>{

  let orders=await userHelpers.getOrders(req.session.user._id)
  // console.log(orders);
  res.render('user/orders',{user:req.session.user,orders})
})
router.get('/ordered-products/:id',async(req,res)=>{

  let orderproducts= await userHelpers.getOrderProducts(req.params.id)
  // console.log(orderproducts);

  res.render('user/ordered-products',{orderproducts})
})
router.post('/verify-payment',(req,res)=>{
  // console.log(req.body);
  userHelpers.verifyPayment(req.body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log('success');
      res.json({status:true})
    })

  }).catch((err)=>{
    res.json({status:false})
  })
})





module.exports = router;
