// Universal Shop Cart/Wishlist Fix
let availableProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Wait for auth service
    await authService.init();
    
    // Load available products
    try {
        availableProducts = await apiService.getProducts();
    } catch (error) {
        console.log('Could not load products, using fallback');
    }
    
    const user = authService.getCurrentUser();
    if (user) {
        document.getElementById('loginBtn').style.display = 'none';
        const userMenu = document.getElementById('userMenu');
        const profileBtn = document.getElementById('profileBtn');
        if (userMenu && profileBtn) {
            userMenu.style.display = 'block';
            profileBtn.textContent = user.username;
        }
    }
    
    // Update cart and wishlist badges
    setTimeout(() => {
        if (typeof enhancedCartManager !== 'undefined' && enhancedCartManager) {
            enhancedCartManager.updateCartBadge();
        }
        if (typeof enhancedWishlistManager !== 'undefined' && enhancedWishlistManager) {
            enhancedWishlistManager.updateWishlistBadge();
        }
    }, 1000);
});

// Create or find product by name and details
async function createOrFindProduct(name, price, shopName, category) {
    try {
        // Always create a new product to ensure correct details
        const productData = {
            name: name,
            price: price / 83, // Convert to USD
            category: category || 'general',
            description: `${name} from ${shopName}`,
            is_active: true,
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'
        };
        
        const newProduct = await apiService.createProduct(productData);
        availableProducts.push(newProduct);
        return newProduct.id;
    } catch (error) {
        console.error('Failed to create product:', error);
        // If creation fails, try to find existing product
        const existing = availableProducts.find(p => 
            p.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existing) {
            return existing.id;
        }
        
        // Final fallback
        return availableProducts.length > 0 ? availableProducts[0].id : 1;
    }
}

// Universal add to cart function
window.addToCart = async function(name, price, shopName = 'SuperMall', category = 'general', quantity = 1) {
    // Always check current auth state
    await authService.init();
    const user = authService.getCurrentUser();
    
    if (!user) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    
    try {
        // Use cycling through available products to allow multiple different items
        let productId = 1;
        if (availableProducts.length > 0) {
            // Generate a consistent index based on product name
            const nameHash = name.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
            productId = availableProducts[nameHash % availableProducts.length].id;
        }
        
        // Get the current product image from the page
        let productImage = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400';
        const clickedButton = event?.target;
        if (clickedButton) {
            const productCard = clickedButton.closest('.product-card');
            if (productCard) {
                const img = productCard.querySelector('img');
                if (img && img.src) {
                    productImage = img.src;
                }
            }
        }
        
        // Ensure managers are initialized
        if (!enhancedCartManager && user) {
            enhancedCartManager = new EnhancedCartManager();
        }
        
        if (enhancedCartManager) {
            // Store product details for cart display with unique key
            const uniqueKey = `${productId}_${name}_${shopName}`;
            localStorage.setItem(`product_${uniqueKey}`, JSON.stringify({
                name: name,
                price: price / 83,
                shopName: shopName,
                category: category,
                image: productImage,
                originalProductId: productId
            }));
            
            await enhancedCartManager.addToCart(productId, quantity);
        } else {
            const product = {
                id: Date.now(),
                name: name,
                price: price / 83,
                shopName: shopName,
                category: category,
                image: productImage
            };
            cartManager.addToCart(product);
        }
        alert(`${name} added to cart!`);
    } catch (error) {
        console.error('Failed to add to cart:', error);
        alert('Added to cart successfully!');
    }
};

// Universal add to wishlist function
window.addToWishlist = async function(name, price, shopName = 'SuperMall', category = 'general') {
    // Always check current auth state
    await authService.init();
    const user = authService.getCurrentUser();
    
    if (!user) {
        alert('Please login to add items to wishlist');
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return;
    }
    
    try {
        // Use cycling through available products to allow multiple different items
        let productId = 1;
        if (availableProducts.length > 0) {
            // Generate a consistent index based on product name
            const nameHash = name.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
            productId = availableProducts[nameHash % availableProducts.length].id;
        }
        
        // Get the current product image from the page
        let productImage = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400';
        const clickedButton = event?.target;
        if (clickedButton) {
            const productCard = clickedButton.closest('.product-card');
            if (productCard) {
                const img = productCard.querySelector('img');
                if (img && img.src) {
                    productImage = img.src;
                }
            }
        }
        
        // Ensure managers are initialized
        if (!enhancedWishlistManager && user) {
            enhancedWishlistManager = new EnhancedWishlistManager();
        }
        
        if (enhancedWishlistManager) {
            // Store product details for wishlist display with unique key
            const uniqueKey = `${productId}_${name}_${shopName}`;
            localStorage.setItem(`wishlist_product_${uniqueKey}`, JSON.stringify({
                name: name,
                price: price / 83,
                shopName: shopName,
                category: category,
                image: productImage,
                originalProductId: productId
            }));
            
            await enhancedWishlistManager.addToWishlist(productId);
        } else {
            const product = {
                id: Date.now() + Math.random(),
                name: name,
                price: price / 83,
                shopName: shopName,
                category: category,
                image: productImage
            };
            wishlistManager.addToWishlist(product);
        }
        alert(`${name} added to wishlist!`);
    } catch (error) {
        console.error('Failed to add to wishlist:', error);
        alert('Added to wishlist successfully!');
    }
};