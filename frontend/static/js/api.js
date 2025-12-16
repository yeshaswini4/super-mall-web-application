const API_BASE = 'http://127.0.0.1:8000/api';

class ApiService {
    async getCsrfToken() {
        try {
            // Get CSRF token from Django endpoint
            const response = await fetch(`${API_BASE}/auth/csrf-token/`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.csrfToken;
            }
            
            // Fallback: Extract from cookies
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

        if (options.method === 'POST') {
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
    async login(emailOrUsername, password) {
        // Try email first, then username
        const loginData = emailOrUsername.includes('@') 
            ? { email: emailOrUsername, password }
            : { username: emailOrUsername, password };
            
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify(loginData)
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

    // Offer endpoints
    async getOffers() {
        return this.request('/offers/');
    }
}

const apiService = new ApiService();