function addToCartBtn(id,name,price,image){if(window.cartService){if(window.cartService.addToCart({id,name,price,image})){alert('✅ Added to cart!');}}}
