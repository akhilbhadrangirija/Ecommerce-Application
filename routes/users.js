var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((productsForDisplay)=>{
    res.render('index',{productsForDisplay,admin:false})
  })
 
});

module.exports = router;
