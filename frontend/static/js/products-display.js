// Universal Product Display with Add to Cart
window.MOCK_PRODUCTS = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 1299, salePrice: 389, discount: 70, category: 'electronics', features: ['5G', '256GB', 'A17 Pro', 'Titanium'], image: 'https://images.unsplash.com/photo-1592286927505-c0d0e0c5d0e0?w=400', stock: 5, shopId: 1 },
    { id: 2, name: 'MacBook Pro M3', price: 2499, salePrice: 874, discount: 65, category: 'electronics', features: ['M3 Chip', '16GB RAM', '512GB SSD'], image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', stock: 3, shopId: 1 },
    { id: 3, name: 'Samsung S24 Ultra', price: 1199, salePrice: 479, discount: 60, category: 'electronics', features: ['5G', '512GB', 'S Pen', '200MP'], image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', stock: 8, shopId: 1 },
    { id: 4, name: 'Organic Apples', price: 5, category: 'grocery', features: ['Fresh', 'Organic', '1kg Pack'], image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', stock: 50, shopId: 2 },
    { id: 5, name: 'Whole Wheat Bread', price: 3, category: 'grocery', features: ['Whole Grain', 'No Preservatives', '500g'], image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 30, shopId: 2 },
    { id: 6, name: 'Nike Air Jordan', price: 250, salePrice: 112, discount: 55, category: 'fashion', features: ['Limited Edition', 'Size 10', 'Premium Leather'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 12, shopId: 3 },
    { id: 7, name: 'Designer Dress', price: 299, salePrice: 149, discount: 50, category: 'fashion', features: ['Evening Wear', 'Silk', 'Size M'], image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', stock: 10, shopId: 3 },
    { id: 8, name: 'Luxury Sofa Set', price: 1999, salePrice: 799, discount: 60, category: 'home', features: ['3-Seater', 'Leather', 'Recliner'], image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', stock: 4, shopId: 4 }
];

function createProductCard(product) {
    const finalPrice = product.salePrice || product.price;
    return `
        <div class="product-card" style="background:white;border-radius:12px;padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.1);position:relative;">
            ${product.discount ? `<div style="position:absolute;top:10px;right:10px;background:#ff6b6b;color:white;padding:8px 12px;border-radius:20px;font-weight:700;z-index:10;">${product.discount}% OFF</div>` : ''}
            <img src="${product.image}" alt="${product.name}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px;">
            <h3 style="margin:10px 0;font-size:18px;">${product.name}</h3>
            ${product.discount ? `<div style="text-decoration:line-through;color:#999;font-size:14px;">$${product.price}</div>` : ''}
            <div style="color:#667eea;font-size:24px;font-weight:700;margin:10px 0;">$${finalPrice}</div>
            ${product.discount ? `<div style="color:#38a169;font-weight:600;margin:5px 0;">💰 Save $${product.price - finalPrice}</div>` : ''}
            <ul style="list-style:none;padding:0;margin:10px 0;font-size:14px;color:#718096;">
                ${product.features.map(f => `<li>✓ ${f}</li>`).join('')}
            </ul>
            <div style="color:#718096;font-size:14px;margin:10px 0;">Stock: ${product.stock} units</div>
            <div style="display:flex;gap:10px;margin-top:15px;">
                <button onclick="addToCart(${product.id})" style="flex:1;background:#667eea;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:600;">🛒 Add to Cart</button>
                <button onclick="addToCompare(${product.id})" style="flex:1;background:#e2e8f0;color:#2d3748;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:600;">⚖️ Compare</button>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    const product = window.MOCK_PRODUCTS.find(p => p.id === productId);
    if (product && window.cartService) {
        if (window.cartService.addToCart(product)) {
            alert('✅ Added to cart!');
        }
    }
}

function addToCompare(productId) {
    if (!window.authService || !window.authService.isAuthenticated()) {
        alert('Please login to compare products');
        window.location.href = 'login.html';
        return;
    }
    if (window.productManager) {
        window.productManager.addToCompare(productId);
    }
}

function displayProducts(containerId, shopId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const products = shopId ? window.MOCK_PRODUCTS.filter(p => p.shopId === shopId) : window.MOCK_PRODUCTS;
    container.innerHTML = products.map(p => createProductCard(p)).join('');
}
