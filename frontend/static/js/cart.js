class CartManager {
    constructor() {
        this.cart = [];
        this.loadCart();
        this.updateCartBadge();
    }

    async loadCart() {
        try {
            if (authService.getCurrentUser()) {
                this.cart = await apiService.getCart();
            } else {
                const saved = localStorage.getItem('cart');
                this.cart = saved ? JSON.parse(saved) : [];
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
            const saved = localStorage.getItem('cart');
            this.cart = saved ? JSON.parse(saved) : [];
        }
        this.updateCartBadge();
    }

    async saveCart() {
        try {
            if (authService.getCurrentUser()) {
                // Cart is managed by backend, no need to save locally
                await this.loadCart(); // Refresh from backend
            } else {
                localStorage.setItem('cart', JSON.stringify(this.cart));
            }
        } catch (error) {
            console.error('Failed to save cart:', error);
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }
        this.updateCartBadge();
    }

    async addToCart(product) {
        // Wait for auth service to initialize
        if (!authService.getCurrentUser()) {
            sessionStorage.setItem('pendingCartItem', JSON.stringify(product));
            window.location.href = 'login.html?redirect=cart';
            return;
        }

        try {
            await apiService.addToCart(product.id, 1);
            await this.loadCart();
            alert(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            // Fallback to local storage
            const discountedProduct = this.applyDiscount(product);
            const existing = this.cart.find(item => item.id === discountedProduct.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.cart.push({...discountedProduct, quantity: 1});
            }
            this.saveCart();
            alert(`${discountedProduct.name} added to cart!`);
        }
    }

    async removeFromCart(cartId) {
        try {
            if (authService.getCurrentUser()) {
                await apiService.removeFromCart(cartId);
                await this.loadCart();
            } else {
                this.cart = this.cart.filter(item => item.id !== cartId);
                this.saveCart();
            }
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    }

    async updateQuantity(cartId, quantity) {
        try {
            if (authService.getCurrentUser()) {
                await apiService.updateCartItem(cartId, quantity);
                await this.loadCart();
            } else {
                const item = this.cart.find(item => item.id === cartId);
                if (item) {
                    item.quantity = quantity;
                    if (quantity <= 0) {
                        this.removeFromCart(cartId);
                    } else {
                        this.saveCart();
                    }
                }
            }
        } catch (error) {
            console.error('Failed to update cart quantity:', error);
        }
    }

    getCart() {
        return this.cart;
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const count = this.getTotalItems();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Apply discount based on offers
    applyDiscount(product) {
        const offers = this.getActiveOffers();
        const applicableOffer = offers.find(offer => 
            offer.category === product.category || 
            offer.shopName === product.shopName
        );
        
        if (applicableOffer) {
            const discountPercent = parseInt(applicableOffer.discount) / 100;
            const discountedPrice = product.price * (1 - discountPercent);
            return {
                ...product,
                originalPrice: product.price,
                price: discountedPrice,
                discount: applicableOffer.discount,
                offerTitle: applicableOffer.title
            };
        }
        return product;
    }

    // Get active offers
    getActiveOffers() {
        return [
            { shopName: 'Tech World Electronics', category: 'electronics', discount: '70%', title: 'iPhone 15 Pro Max - Mega Sale' },
            { shopName: 'Croma Electronics', category: 'electronics', discount: '65%', title: 'MacBook Pro M3 - Limited Time' },
            { shopName: 'Reliance Digital', category: 'electronics', discount: '60%', title: 'Samsung S24 Ultra - Hot Deal' },
            { shopName: 'Max Fashion', category: 'fashion', discount: '55%', title: 'Nike & Adidas Shoes' },
            { shopName: 'Home Centre', category: 'home', discount: '60%', title: 'Luxury Sofas' },
            { shopName: 'Fashion Hub', category: 'fashion', discount: '50%', title: 'Designer Dresses' },
            { shopName: 'Health & Glow', category: 'beauty', discount: '40%', title: 'Luxury Skincare' },
            { shopName: 'Fresh Mart', category: 'grocery', discount: '30%', title: 'Organic Fruits' }
        ];
    }

    async handlePendingCartItem() {
        const pendingItem = sessionStorage.getItem('pendingCartItem');
        if (pendingItem) {
            const product = JSON.parse(pendingItem);
            sessionStorage.removeItem('pendingCartItem');
            await this.addToCart(product);
        }
    }
}

const cartManager = new CartManager();