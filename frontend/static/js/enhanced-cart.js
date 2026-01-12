class EnhancedCartManager {
    constructor() {
        this.cart = [];
        this.init();
    }

    async init() {
        await this.loadCart();
        this.updateCartBadge();
    }

    async loadCart() {
        try {
            this.cart = await apiService.getCart();
            this.updateCartBadge();
            return this.cart;
        } catch (error) {
            console.error('Failed to load cart:', error);
            this.cart = [];
            return [];
        }
    }

    async addToCart(productId, quantity = 1) {
        // Check if user is authenticated
        const user = authService.getCurrentUser();
        if (!user) {
            // Store the product info for after login
            localStorage.setItem('pendingCartItem', JSON.stringify({ productId, quantity }));
            // Redirect to login with return URL
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        
        try {
            const result = await apiService.addToCart(productId, quantity);
            await this.loadCart();
            this.showNotification(`Product added to cart!`, 'success');
            return result;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            this.showNotification('Failed to add product to cart', 'error');
            throw error;
        }
    }

    async removeFromCart(cartId) {
        try {
            await apiService.removeFromCart(cartId);
            await this.loadCart();
            this.showNotification('Product removed from cart', 'success');
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            this.showNotification('Failed to remove product from cart', 'error');
        }
    }

    async updateCartItem(cartId, quantity) {
        try {
            await apiService.updateCartItem(cartId, quantity);
            await this.loadCart();
        } catch (error) {
            console.error('Failed to update cart item:', error);
            this.showNotification('Failed to update cart item', 'error');
        }
    }

    async createOrder() {
        try {
            const order = await apiService.request('/orders/create-order/', { method: 'POST' });
            await this.loadCart();
            this.showNotification('Order placed successfully!', 'success');
            return order;
        } catch (error) {
            console.error('Failed to create order:', error);
            this.showNotification('Failed to place order', 'error');
            throw error;
        }
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.cart.length;
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    async handlePendingCartItem() {
        const pendingItem = localStorage.getItem('pendingCartItem');
        const pendingWishlistItem = localStorage.getItem('pendingWishlistItem');
        
        if (pendingItem) {
            try {
                const { productId, quantity } = JSON.parse(pendingItem);
                await this.addToCart(productId, quantity);
                localStorage.removeItem('pendingCartItem');
            } catch (error) {
                console.error('Failed to add pending cart item:', error);
            }
        }
        
        if (pendingWishlistItem) {
            try {
                const { productId } = JSON.parse(pendingWishlistItem);
                await enhancedWishlistManager.addToWishlist(productId);
                localStorage.removeItem('pendingWishlistItem');
            } catch (error) {
                console.error('Failed to add pending wishlist item:', error);
            }
        }
    }

    showNotification(message, type = 'info') {
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
        `;
        notification.textContent = `${icon} ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

class EnhancedWishlistManager {
    constructor() {
        this.wishlist = [];
        this.init();
    }

    async init() {
        await this.loadWishlist();
        this.updateWishlistBadge();
    }

    async loadWishlist() {
        try {
            this.wishlist = await apiService.getWishlist();
            this.updateWishlistBadge();
            return this.wishlist;
        } catch (error) {
            console.error('Failed to load wishlist:', error);
            this.wishlist = [];
            return [];
        }
    }

    async addToWishlist(productId) {
        // Check if user is authenticated
        const user = authService.getCurrentUser();
        if (!user) {
            // Store the product info for after login
            localStorage.setItem('pendingWishlistItem', JSON.stringify({ productId }));
            // Redirect to login with return URL
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
        
        try {
            const result = await apiService.addToWishlist(productId);
            await this.loadWishlist();
            this.showNotification('Product added to wishlist!', 'success');
            return result;
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            this.showNotification('Failed to add product to wishlist', 'error');
            throw error;
        }
    }

    async removeFromWishlist(wishlistId) {
        try {
            await apiService.removeFromWishlist(wishlistId);
            await this.loadWishlist();
            this.showNotification('Product removed from wishlist', 'success');
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            this.showNotification('Failed to remove product from wishlist', 'error');
        }
    }

    updateWishlistBadge() {
        const badge = document.getElementById('wishlistBadge');
        if (badge) {
            const count = this.wishlist.length;
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.product.id === productId);
    }

    showNotification(message, type = 'info') {
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
        `;
        notification.textContent = `${icon} ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global enhanced managers - initialize after auth service is ready
let enhancedCartManager;
let enhancedWishlistManager;

// Initialize managers after auth service is ready
function initializeManagers() {
    const user = authService.getCurrentUser();
    if (user) {
        enhancedCartManager = new EnhancedCartManager();
        enhancedWishlistManager = new EnhancedWishlistManager();
    }
}

// Initialize when DOM loads and periodically check
document.addEventListener('DOMContentLoaded', () => {
    // Try to initialize immediately
    setTimeout(initializeManagers, 100);
    
    // Keep trying until auth service is ready
    const checkAuth = setInterval(() => {
        if (authService.getCurrentUser() && !enhancedCartManager) {
            initializeManagers();
            clearInterval(checkAuth);
        }
    }, 500);
    
    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkAuth), 10000);
});