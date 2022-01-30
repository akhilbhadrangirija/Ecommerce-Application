var express = require('express');
var router = express.Router();

var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {

  let products=[
    {index:1,
      name:"Iphone 13",
    price:100000,
    img:"https://www.reliancedigital.in/medias/Apple-iPhone-13-Smartphone-491997699-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wyNTgzM3xpbWFnZS9qcGVnfGltYWdlcy9oMWYvaDg0Lzk2MzQ2MjEzOTA4NzguanBnfGY3YTVhNjVjMGRkYWE1NWNkMjRmOTQ0YjEyZWUxMWU1MjE1ODM5MTlmOGI0ZjA5MWRlNDg5OWI3OTEyYjM4YWU",
    category:"Mobile",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, fugiat!"

    },
    {
      index:2,
      name:"S21 Ultra",
    price:100000,
    img:"https://www.reliancedigital.in/medias/Samsung-S21-Ultra-Smart-Phones-491946875-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3w1NDgzOTN8aW1hZ2UvanBlZ3xpbWFnZXMvaDU5L2hhZi85NDYzMjYyNzA3NzQyLmpwZ3xlYzczN2Q1NzQyNDJiZTcxZWMwMThmYmRiNjZjNmI1OTk5OGVlYjZhMTA2ZTcxZWM3ZGUzYTgyYzg1ZmMzYTBm",
    category:"Mobile",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, fugiat!"

    },
    {index:3,
      name:"Pixel 6pro",
    price:100000,
    img:"https://m.media-amazon.com/images/I/71EyTcGszpL._SX679_.jpg",
    category:"Mobile",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, fugiat!"

    },
    {index:4,
      name:"MI 11 ultra",
    price:70000,
    img:"https://i02.appmifile.com/572_operator_in/23/04/2021/48af8827eb8c782223c0ad6bfd635632.jpg",
    category:"Mobile",
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, fugiat!"

    },
  ]

  res.render('admin/view-products',{products,admin:true});
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
   console.log(req.body);
   var image = req.files.Image;
   
  productHelper.addProduct(req.body,(id)=>{
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
    res.render("admin/add-product")
      }else{
        console.log(err);
      res.render("admin/add-product")

      }
      
    })
  })
})
module.exports = router;
