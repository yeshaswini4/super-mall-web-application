// Universal Add to Cart Handler for Shop Pages
class ShopCartHandler {
    constructor(shopName, shopCategory) {
        this.shopName = shopName;
        this.shopCategory = shopCategory;
    }

    // Display products with discount information
    displayProducts(products, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = products.map(product => {
            const discountedProduct = cartManager.applyDiscount({
                ...product, 
                shopName: this.shopName,
                category: this.shopCategory
            });
            
            const hasDiscount = discountedProduct.originalPrice;
            const originalPrice = Math.round((discountedProduct.originalPrice || product.price) * 83);
            const currentPrice = Math.round(discountedProduct.price * 83);
            
            return `
            <div class="product-card" style="${hasDiscount ? 'border-left:4px solid #ff6b6b;' : ''}">
                ${hasDiscount ? `<div style="background:#ff6b6b;color:white;padding:5px 10px;margin:-20px -20px 15px;border-radius:12px 12px 0 0;text-align:center;font-weight:700;font-size:12px;">🔥 ${discountedProduct.discount} OFF</div>` : ''}
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="product-price">
                    ${hasDiscount ? `<span style="text-decoration:line-through;color:#999;font-size:1rem;">₹${originalPrice}</span><br>` : ''}
                    ₹${currentPrice}
                    ${hasDiscount ? `<span style="color:#48bb78;font-size:0.9rem;margin-left:10px;">Save ₹${originalPrice - currentPrice}</span>` : ''}
                </div>
                ${hasDiscount ? `<p style="color:#ff6b6b;font-size:0.85rem;font-weight:600;margin:5px 0;">${discountedProduct.offerTitle}</p>` : ''}
                <ul class="product-features">
                    ${product.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
                <p style="color: #666; font-size: 0.9rem;">Stock: ${product.stock} units</p>
                <div style="display:flex;gap:10px;margin-top:10px;">
                    <button onclick="shopCartHandler.addToCart(${product.id})" style="flex:1;background:#48bb78;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:600;">🛒 Add to Cart</button>
                    <button onclick="productManager.addToCompare(${product.id})" style="flex:1;background:#667eea;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:600;">⚖️ Compare</button>
                </div>
            </div>
            `;
        }).join('');
    }

    // Add product to cart
    async addToCart(productId) {
        const product = productManager.getProduct(productId);
        if (product) {
            // Check if user is authenticated
            const user = authService.getCurrentUser();
            if (!user) {
                alert('Please login to add items to cart');
                window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }
            
            try {
                // Use enhanced cart manager if available, otherwise fallback to regular cart
                if (typeof enhancedCartManager !== 'undefined' && enhancedCartManager) {
                    await enhancedCartManager.addToCart(productId, 1);
                } else {
                    // Fallback to old cart manager
                    cartManager.addToCart({
                        ...product, 
                        shopName: this.shopName,
                        category: this.shopCategory
                    });
                }
            } catch (error) {
                console.error('Failed to add to cart:', error);
                alert('Failed to add item to cart. Please try again.');
            }
        }
    }
}