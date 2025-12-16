class WishlistManager {
    constructor() {
        this.loadWishlist();
        this.updateWishlistBadge();
    }

    loadWishlist() {
        const saved = localStorage.getItem('wishlist');
        this.wishlist = saved ? JSON.parse(saved) : [];
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistBadge();
    }

    addToWishlist(product) {
        if (!authService.isAuthenticated()) {
            alert('Please login to add items to wishlist');
            window.location.href = 'login.html';
            return;
        }

        const existing = this.wishlist.find(item => item.id === product.id);
        if (existing) {
            alert('Item already in wishlist!');
            return;
        }

        this.wishlist.push(product);
        this.saveWishlist();
        alert(`${product.name} added to wishlist!`);
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
    }

    getWishlist() {
        return this.wishlist;
    }

    getTotalItems() {
        return this.wishlist.length;
    }

    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
    }

    updateWishlistBadge() {
        const badge = document.getElementById('wishlistBadge');
        const count = this.getTotalItems();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }
}

const wishlistManager = new WishlistManager();