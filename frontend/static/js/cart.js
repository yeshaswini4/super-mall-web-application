class CartManager {
    constructor() {
        this.loadCart();
        this.updateCartBadge();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        this.cart = saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartBadge();
    }

    addToCart(product) {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            // Store the product in session for after login
            sessionStorage.setItem('pendingCartItem', JSON.stringify(product));
            // Redirect to login
            window.location.href = 'login.html?redirect=cart';
            return;
        }

        // Apply discount if available
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

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
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

    // Handle pending cart item after login
    handlePendingCartItem() {
        const pendingItem = sessionStorage.getItem('pendingCartItem');
        if (pendingItem) {
            const product = JSON.parse(pendingItem);
            sessionStorage.removeItem('pendingCartItem'); // Remove first to prevent recursion
            
            // Apply discount if available
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
}

const cartManager = new CartManager();