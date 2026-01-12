class WishlistManager {
    constructor() {
        this.wishlist = [];
        this.loadWishlist();
        this.updateWishlistBadge();
    }

    async loadWishlist() {
        try {
            if (authService.isAuthenticated()) {
                this.wishlist = await apiService.getWishlist();
            } else {
                const saved = localStorage.getItem('wishlist');
                this.wishlist = saved ? JSON.parse(saved) : [];
            }
        } catch (error) {
            console.error('Failed to load wishlist:', error);
            const saved = localStorage.getItem('wishlist');
            this.wishlist = saved ? JSON.parse(saved) : [];
        }
        this.updateWishlistBadge();
    }

    async saveWishlist() {
        try {
            if (authService.isAuthenticated()) {
                await this.loadWishlist();
            } else {
                localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
            }
        } catch (error) {
            console.error('Failed to save wishlist:', error);
            localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        }
        this.updateWishlistBadge();
    }

    async addToWishlist(product) {
        if (!authService.isAuthenticated()) {
            alert('Please login to add items to wishlist');
            window.location.href = 'login.html';
            return;
        }

        try {
            await apiService.addToWishlist(product.id);
            await this.loadWishlist();
            alert(`${product.name} added to wishlist!`);
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            const existing = this.wishlist.find(item => item.id === product.id);
            if (existing) {
                alert('Item already in wishlist!');
                return;
            }
            this.wishlist.push(product);
            this.saveWishlist();
            alert(`${product.name} added to wishlist!`);
        }
    }

    async removeFromWishlist(wishlistId) {
        try {
            if (authService.isAuthenticated()) {
                await apiService.removeFromWishlist(wishlistId);
                await this.loadWishlist();
            } else {
                this.wishlist = this.wishlist.filter(item => item.id !== wishlistId);
                this.saveWishlist();
            }
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
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