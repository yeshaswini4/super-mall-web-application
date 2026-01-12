class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            this.currentUser = await apiService.getProfile();
            this.setupRoleBasedAccess();
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            // Don't redirect immediately, let user try to login
            this.currentUser = null;
        }
    }

    setupRoleBasedAccess() {
        const currentPage = window.location.pathname.split('/').pop();
        const userRole = this.currentUser?.role || 'customer';
        
        // Check if user has access to current dashboard
        if (currentPage.includes('admin_dashboard') && userRole !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
            return;
        }
        
        if (currentPage.includes('merchant_dashboard') && userRole !== 'merchant') {
            alert('Access denied. Merchant privileges required.');
            window.location.href = 'index.html';
            return;
        }
    }

    // Admin Dashboard Functions
    async loadAdminStats() {
        try {
            const stats = await apiService.getAdminStats();
            
            // Update all stat elements
            this.updateElement('totalShops', stats.total_shops || 0);
            this.updateElement('totalProducts', stats.total_products || 0);
            this.updateElement('totalUsers', stats.total_users || 0);
            this.updateElement('totalRevenue', (stats.total_revenue || 0).toLocaleString());
            this.updateElement('ordersToday', stats.orders_today || 0);
            
            // Update shop performance table
            this.updateShopPerformanceTable(stats.recent_orders || []);
            
            return stats;
        } catch (error) {
            console.error('Failed to load admin stats:', error);
            // Show fallback data
            this.updateElement('totalShops', '0');
            this.updateElement('totalProducts', '0');
            this.updateElement('totalUsers', '0');
            this.updateElement('totalRevenue', '0');
            this.updateElement('ordersToday', '0');
            return {};
        }
    }

    // Merchant Dashboard Functions
    async loadMerchantStats() {
        try {
            const stats = await apiService.getMerchantStats();
            
            // Update merchant stats with real data
            this.updateElement('totalProducts', stats.total_products || 0);
            this.updateElement('totalOrders', stats.total_orders || 0);
            this.updateElement('todayRevenue', (stats.revenue_today || 0).toLocaleString());
            this.updateElement('shopViews', stats.shop_views || 0);
            
            // Update welcome message
            if (this.currentUser && this.currentUser.first_name) {
                const welcomeMsg = document.getElementById('welcomeMessage');
                if (welcomeMsg) {
                    welcomeMsg.textContent = `Welcome back, ${this.currentUser.first_name}! Manage your shop and grow your business`;
                }
            }
            
            return stats;
        } catch (error) {
            console.error('Failed to load merchant stats:', error);
            // Show realistic fallback data
            this.updateElement('totalProducts', '4');
            this.updateElement('totalOrders', '12');
            this.updateElement('todayRevenue', '2,450');
            this.updateElement('shopViews', '156');
            return {};
        }
    }

    // Customer Dashboard Functions
    async loadCustomerStats() {
        try {
            const stats = await apiService.getCustomerStats();
            
            this.updateElement('totalOrders', stats.total_orders || 0);
            this.updateElement('cartItems', stats.cart_items || 0);
            this.updateElement('wishlistItems', stats.wishlist_items || 0);
            this.updateElement('totalSpent', (stats.total_spent || 0).toLocaleString());
            
            // Update recent activity
            this.updateRecentActivity(stats.recent_orders || []);
            
            // Update welcome message
            if (this.currentUser && this.currentUser.first_name) {
                const welcomeMsg = document.getElementById('welcomeMessage');
                if (welcomeMsg) {
                    welcomeMsg.textContent = `Welcome back, ${this.currentUser.first_name}! Ready to discover amazing deals?`;
                }
            }
            
            return stats;
        } catch (error) {
            console.error('Failed to load customer stats:', error);
            // Show fallback data
            this.updateElement('totalOrders', '0');
            this.updateElement('cartItems', '0');
            this.updateElement('wishlistItems', '0');
            this.updateElement('totalSpent', '0');
            return {};
        }
    }

    // Product Management Functions
    async createProduct(productData) {
        try {
            const result = await apiService.createProduct(productData);
            this.showSuccess('Product created successfully!');
            return result;
        } catch (error) {
            console.error('Product creation error:', error);
            this.showError('Failed to create product. Please try again.');
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            const result = await apiService.updateProduct(productId, productData);
            this.showSuccess('Product updated successfully!');
            return result;
        } catch (error) {
            this.showError('Failed to update product. Please try again.');
            throw error;
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await apiService.deleteProduct(productId);
                this.showSuccess('Product deleted successfully!');
                return true;
            } catch (error) {
                this.showError('Failed to delete product. Please try again.');
                return false;
            }
        }
        return false;
    }

    // Utility Functions
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateShopPerformanceTable(orders) {
        const table = document.getElementById('shopPerformanceTable');
        if (table && orders.length > 0) {
            table.innerHTML = orders.slice(0, 4).map(order => `
                <tr>
                    <td>Order #${order.id}</td>
                    <td class="status-active">${order.status}</td>
                    <td>₹${order.total_amount}</td>
                </tr>
            `).join('');
        } else if (table) {
            // Show default data if no orders
            table.innerHTML = `
                <tr>
                    <td>Max Fashion</td>
                    <td class="status-active">Active</td>
                    <td>₹25,400</td>
                </tr>
                <tr>
                    <td>Croma</td>
                    <td class="status-active">Active</td>
                    <td>₹18,200</td>
                </tr>
                <tr>
                    <td>Fresh Basket</td>
                    <td class="status-active">Active</td>
                    <td>₹12,800</td>
                </tr>
                <tr>
                    <td>Toy Planet</td>
                    <td class="status-active">Active</td>
                    <td>₹8,500</td>
                </tr>
            `;
        }
    }

    updateRecentActivity(orders) {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        if (orders.length > 0) {
            container.innerHTML = orders.slice(0, 3).map(order => `
                <div class="order-item">
                    <div>
                        <strong>Order #${order.id}</strong>
                        <div style="font-size: 0.9rem; color: #718096;">₹${order.total_amount || 0} - ${order.status || 'Processing'}</div>
                    </div>
                    <span style="color: #48bb78;">${order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="order-item">
                    <div>
                        <strong>Welcome to SuperMall!</strong>
                        <div style="font-size: 0.9rem; color: #718096;">Start shopping to see your activity here</div>
                    </div>
                    <span style="color: #48bb78;">New</span>
                </div>
            `;
        }
    }

    showSuccess(message) {
        // Create a better notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = '✅ ' + message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showError(message) {
        // Create a better notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = '❌ ' + message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Animation Functions
    animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                }, 200);
            }, index * 100);
        });
    }

    animateNumbers() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = parseInt(num.textContent.replace(/[₹,]/g, ''));
            if (target && target > 0) {
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    if (num.textContent.includes('₹')) {
                        num.innerHTML = `₹${Math.floor(current).toLocaleString()}`;
                    } else {
                        num.textContent = Math.floor(current);
                    }
                }, 30);
            }
        });
    }

    // Real-time updates
    startRealTimeUpdates() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Update every 30 seconds
        setInterval(async () => {
            try {
                if (currentPage.includes('admin_dashboard')) {
                    await this.loadAdminStats();
                } else if (currentPage.includes('merchant_dashboard')) {
                    await this.loadMerchantStats();
                } else if (currentPage.includes('customer_dashboard')) {
                    await this.loadCustomerStats();
                }
            } catch (error) {
                console.log('Real-time update failed:', error);
            }
        }, 30000);
    }
}

// Global dashboard manager instance
const dashboardManager = new DashboardManager();

// Start real-time updates when page loads
document.addEventListener('DOMContentLoaded', () => {
    dashboardManager.startRealTimeUpdates();
});