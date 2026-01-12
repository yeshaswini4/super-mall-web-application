const API_BASE = (typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : null) || 'http://127.0.0.1:8000/api';

class ApiService {
    async getCsrfToken() {
        try {
            const response = await fetch(`${API_BASE}/auth/csrf-token/`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.csrfToken;
            }
            
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'csrftoken') {
                    return value;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
            const csrfToken = await this.getCsrfToken();
            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }
        }

        const config = {
            headers,
            credentials: 'include',
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async logout() {
        return this.request('/auth/logout/', { method: 'POST' });
    }

    async getProfile() {
        return this.request('/auth/profile/');
    }

    // Shop endpoints
    async getShops() {
        return this.request('/shops/list/');
    }

    async getShopsByCategory(category) {
        return this.request(`/shops/category/${category}/`);
    }

    async getShopsByFloor(floor) {
        return this.request(`/shops/floor/${floor}/`);
    }

    async createShop(shopData) {
        return this.request('/shops/list/', {
            method: 'POST',
            body: JSON.stringify(shopData)
        });
    }

    async updateShop(shopId, shopData) {
        return this.request(`/shops/list/${shopId}/`, {
            method: 'PUT',
            body: JSON.stringify(shopData)
        });
    }

    // Product endpoints
    async getProducts() {
        return this.request('/products/list/');
    }

    async getProductsByShop(shopId) {
        return this.request(`/products/shop/${shopId}/`);
    }

    async getProductsByCategory(category) {
        return this.request(`/products/category/${category}/`);
    }

    async createProduct(productData) {
        return this.request('/products/list/', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(productId, productData) {
        return this.request(`/products/list/${productId}/`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(productId) {
        return this.request(`/products/list/${productId}/`, {
            method: 'DELETE'
        });
    }

    // Product approval endpoints
    async getPendingProducts() {
        return this.request('/products/pending/');
    }

    async approveProduct(productId) {
        return this.request(`/products/${productId}/approve/`, {
            method: 'POST'
        });
    }

    async rejectProduct(productId) {
        return this.request(`/products/${productId}/reject/`, {
            method: 'POST'
        });
    }

    // Cart endpoints
    async getCart() {
        return this.request('/orders/cart/');
    }

    async addToCart(productId, quantity = 1) {
        return this.request('/orders/add-to-cart/', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity })
        });
    }

    async removeFromCart(cartId) {
        return this.request(`/orders/cart/${cartId}/`, { method: 'DELETE' });
    }

    async updateCartItem(cartId, quantity) {
        return this.request(`/orders/cart/${cartId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity })
        });
    }

    // Wishlist endpoints
    async getWishlist() {
        return this.request('/orders/wishlist/');
    }

    async addToWishlist(productId) {
        return this.request('/orders/add-to-wishlist/', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId })
        });
    }

    async removeFromWishlist(wishlistId) {
        return this.request(`/orders/wishlist/${wishlistId}/`, { method: 'DELETE' });
    }

    // Order endpoints
    async getOrders() {
        return this.request('/orders/orders/');
    }

    async createOrder(orderData) {
        return this.request('/orders/create-order/', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Offer endpoints
    async getOffers() {
        return this.request('/offers/');
    }

    async createOffer(offerData) {
        return this.request('/offers/', {
            method: 'POST',
            body: JSON.stringify(offerData)
        });
    }

    // Dashboard endpoints
    async getDashboardStats(role) {
        return this.request(`/auth/dashboard-stats/?role=${role}`);
    }

    async getAdminStats() {
        return this.request('/auth/admin-stats/');
    }

    async getMerchantStats() {
        return this.request('/auth/merchant-stats/');
    }

    async getCustomerStats() {
        return this.request('/auth/customer-stats/');
    }

    // Merchant-specific endpoints
    async getMerchantProducts() {
        return this.request('/products/merchant/');
    }

    async getMerchantShops() {
        return this.request('/shops/merchant/');
    }
}

const apiService = new ApiService();