class MerchantProductManager {
    constructor() {
        this.products = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            this.currentUser = await apiService.getProfile();
            if (this.currentUser.role === 'merchant') {
                await this.loadMerchantProducts();
            }
        } catch (error) {
            console.error('Failed to initialize merchant product manager:', error);
        }
    }

    async loadMerchantProducts() {
        try {
            this.products = await apiService.getMerchantProducts();
            this.renderProductList();
            return this.products;
        } catch (error) {
            console.error('Failed to load merchant products:', error);
            this.products = [];
            return [];
        }
    }

    async createProduct(productData) {
        try {
            const result = await apiService.createProduct(productData);
            await this.loadMerchantProducts();
            this.showNotification('Product created successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Failed to create product:', error);
            this.showNotification('Failed to create product', 'error');
            throw error;
        }
    }

    async updateProduct(productId, productData) {
        try {
            const result = await apiService.updateProduct(productId, productData);
            await this.loadMerchantProducts();
            this.showNotification('Product updated successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Failed to update product:', error);
            this.showNotification('Failed to update product', 'error');
            throw error;
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await apiService.deleteProduct(productId);
                await this.loadMerchantProducts();
                this.showNotification('Product deleted successfully!', 'success');
                return true;
            } catch (error) {
                console.error('Failed to delete product:', error);
                this.showNotification('Failed to delete product', 'error');
                return false;
            }
        }
        return false;
    }

    renderProductList() {
        const container = document.getElementById('merchantProductsList');
        if (!container) return;

        if (this.products.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #718096;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📦</div>
                    <h3>No Products Yet</h3>
                    <p>Start by adding your first product to your shop</p>
                    <button onclick="merchantProductManager.showAddProductForm()" class="btn-primary">Add Product</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>Your Products (${this.products.length})</h3>
                <button onclick="merchantProductManager.showAddProductForm()" class="btn-primary">Add New Product</button>
            </div>
            <div class="products-grid">
                ${this.products.map(product => this.renderProductCard(product)).join('')}
            </div>
        `;
    }

    renderProductCard(product) {
        return `
            <div class="product-card" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0; color: #2d3748;">${product.name}</h4>
                        <p style="margin: 5px 0; color: #718096; font-size: 0.9rem;">${product.category}</p>
                        <p style="margin: 5px 0; font-weight: 600; color: #48bb78; font-size: 1.2rem;">₹${product.price}</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="merchantProductManager.editProduct(${product.id})" 
                                style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
                            ✏️ Edit
                        </button>
                        <button onclick="merchantProductManager.deleteProduct(${product.id})" 
                                style="background: #f56565; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
                <p style="margin: 10px 0; color: #4a5568; font-size: 0.9rem;">${product.description || 'No description'}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <span style="color: #718096; font-size: 0.8rem;">Stock: ${product.stock_quantity || 0}</span>
                    <span style="color: ${product.is_active ? '#48bb78' : '#f56565'}; font-weight: 600; font-size: 0.8rem;">
                        ${product.is_active ? '✅ Active' : '❌ Inactive'}
                    </span>
                </div>
            </div>
        `;
    }

    showAddProductForm() {
        this.showProductForm();
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.showProductForm(product);
        }
    }

    showProductForm(product = null) {
        const isEdit = product !== null;
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
                <h3>${isEdit ? 'Edit Product' : 'Add New Product'}</h3>
                <form id="productForm">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Product Name *</label>
                        <input type="text" id="productName" value="${product?.name || ''}" required 
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Price (₹) *</label>
                        <input type="number" id="productPrice" value="${product?.price || ''}" required min="0" step="0.01"
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Category *</label>
                        <select id="productCategory" required 
                                style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <option value="">Select Category</option>
                            <option value="electronics" ${product?.category === 'electronics' ? 'selected' : ''}>Electronics</option>
                            <option value="fashion" ${product?.category === 'fashion' ? 'selected' : ''}>Fashion</option>
                            <option value="home" ${product?.category === 'home' ? 'selected' : ''}>Home & Kitchen</option>
                            <option value="beauty" ${product?.category === 'beauty' ? 'selected' : ''}>Beauty & Personal Care</option>
                            <option value="grocery" ${product?.category === 'grocery' ? 'selected' : ''}>Grocery</option>
                            <option value="toys" ${product?.category === 'toys' ? 'selected' : ''}>Toys & Games</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Stock Quantity</label>
                        <input type="number" id="productStock" value="${product?.stock_quantity || 0}" min="0"
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Image URL</label>
                        <input type="url" id="productImage" value="${product?.image_url || ''}"
                               style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Description</label>
                        <textarea id="productDescription" rows="3" 
                                  style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">${product?.description || ''}</textarea>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="productActive" ${product?.is_active !== false ? 'checked' : ''}>
                            <span>Product is active</span>
                        </label>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="this.closest('.modal').remove()" 
                                style="background: #e2e8f0; color: #4a5568; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer;">
                            Cancel
                        </button>
                        <button type="submit" 
                                style="background: #48bb78; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer;">
                            ${isEdit ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        modal.className = 'modal';
        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('productForm').onsubmit = async (e) => {
            e.preventDefault();
            
            const productData = {
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                category: document.getElementById('productCategory').value,
                stock_quantity: parseInt(document.getElementById('productStock').value) || 0,
                image_url: document.getElementById('productImage').value || 'https://via.placeholder.com/300x200',
                description: document.getElementById('productDescription').value,
                is_active: document.getElementById('productActive').checked
            };

            try {
                if (isEdit) {
                    await this.updateProduct(product.id, productData);
                } else {
                    await this.createProduct(productData);
                }
                modal.remove();
            } catch (error) {
                console.error('Form submission error:', error);
            }
        };
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

// Global merchant product manager
const merchantProductManager = new MerchantProductManager();