// Merchant Dashboard Logic
let products = [];
let offers = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!authService.hasRole('merchant')) {
        alert('Access denied. Merchant only.');
        window.location.href = 'index.html';
        return;
    }

    const user = authService.getCurrentUser();
    document.getElementById('merchantName').textContent = user.name;
    loadMerchantData();
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
}

function loadMerchantData() {
    loadProducts();
    loadOffers();
}

// Shop Form
document.getElementById('shopForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const shopData = {
        name: document.getElementById('shopName').value,
        description: document.getElementById('shopDesc').value,
        category: document.getElementById('shopCategory').value,
        floor: document.getElementById('shopFloor').value,
        location: document.getElementById('shopLocation').value
    };
    
    authService.logAction('create_shop', 'merchant', 'shop', Date.now(), shopData);
    alert('Shop saved successfully!');
});

// Product Management
function showAddProduct() {
    document.getElementById('addProductForm').style.display = 'block';
}

function hideAddProduct() {
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('productForm').reset();
}

document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        stock: document.getElementById('productStock').value,
        description: document.getElementById('productDesc').value,
        features: document.getElementById('productFeatures').value.split(',')
    };
    
    products.push(product);
    authService.logAction('add_product', 'merchant', 'product', product.id, product);
    alert('Product added successfully!');
    hideAddProduct();
    loadProducts();
});

function loadProducts() {
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn" onclick="editProduct(${p.id})">Edit</button>
                <button class="btn" onclick="deleteProduct(${p.id})">Delete</button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('totalProducts').textContent = products.length;
}

function deleteProduct(id) {
    if (confirm('Delete this product?')) {
        products = products.filter(p => p.id !== id);
        authService.logAction('delete_product', 'merchant', 'product', id);
        loadProducts();
    }
}

// Offer Management
function showAddOffer() {
    document.getElementById('addOfferForm').style.display = 'block';
}

function hideAddOffer() {
    document.getElementById('addOfferForm').style.display = 'none';
    document.getElementById('offerForm').reset();
}

document.getElementById('offerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const offer = {
        id: Date.now(),
        discount: document.getElementById('offerDiscount').value,
        validUntil: document.getElementById('offerValidUntil').value,
        applyTo: document.getElementById('offerApplyTo').value
    };
    
    offers.push(offer);
    authService.logAction('create_offer', 'merchant', 'offer', offer.id, offer);
    alert('Offer created successfully!');
    hideAddOffer();
    loadOffers();
});

function loadOffers() {
    const tbody = document.querySelector('#offersTable tbody');
    tbody.innerHTML = offers.map(o => `
        <tr>
            <td>${o.discount}%</td>
            <td>${o.validUntil}</td>
            <td>${o.applyTo}</td>
            <td>
                <button class="btn" onclick="deleteOffer(${o.id})">Delete</button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('totalOffers').textContent = offers.length;
}

function deleteOffer(id) {
    if (confirm('Delete this offer?')) {
        offers = offers.filter(o => o.id !== id);
        authService.logAction('delete_offer', 'merchant', 'offer', id);
        loadOffers();
    }
}
