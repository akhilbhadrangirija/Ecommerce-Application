function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart-Count').html()
                count=parseInt(count)+1
                $("#cart-Count").html(count)
            }
            // alert(response)
        }
    })
}