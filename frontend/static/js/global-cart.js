// Global cart handler for adding items to cart
window.addToCartGlobal = async function(productId, quantity = 1) {
    // Check if user is authenticated
    const user = authService.getCurrentUser();
    if (!user) {
        // Store the product info for after login
        localStorage.setItem('pendingCartItem', JSON.stringify({ productId, quantity }));
        // Show login prompt
        if (confirm('Please login to add items to cart. Would you like to login now?')) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
        return;
    }
    
    try {
        // Use enhanced cart manager if available, otherwise use API directly
        if (typeof enhancedCartManager !== 'undefined') {
            await enhancedCartManager.addToCart(productId, quantity);
        } else {
            await apiService.addToCart(productId, quantity);
            showNotification('Product added to cart!', 'success');
        }
    } catch (error) {
        console.error('Failed to add to cart:', error);
        showNotification('Failed to add product to cart', 'error');
    }
};

// Global wishlist handler
window.addToWishlistGlobal = async function(productId) {
    // Check if user is authenticated
    const user = authService.getCurrentUser();
    if (!user) {
        // Store the product info for after login
        localStorage.setItem('pendingWishlistItem', JSON.stringify({ productId }));
        // Show login prompt
        if (confirm('Please login to add items to wishlist. Would you like to login now?')) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
        return;
    }
    
    try {
        // Use enhanced wishlist manager if available, otherwise use API directly
        if (typeof enhancedWishlistManager !== 'undefined') {
            await enhancedWishlistManager.addToWishlist(productId);
        } else {
            await apiService.addToWishlist(productId);
            showNotification('Product added to wishlist!', 'success');
        }
    } catch (error) {
        console.error('Failed to add to wishlist:', error);
        showNotification('Failed to add product to wishlist', 'error');
    }
};

// Global notification function
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
    `;
    notification.textContent = `${icon} ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};