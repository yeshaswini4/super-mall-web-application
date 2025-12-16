// static/js/products.js

const productGrid = document.getElementById("productGrid");
const compareA = document.getElementById("compareA");
const compareB = document.getElementById("compareB");

// Simple in-memory products list
let products = [
    { id: 1, name: "Laptop X", price: 55000, img: "/static/images/placeholder-shop.jpg", shopId: 1, desc: "High performance laptop" },
    { id: 2, name: "Smart Watch", price: 3499, img: "/static/images/placeholder-shop.jpg", shopId: 3, desc: "Smart watch with heart-rate" },
    { id: 3, name: "Headphones", price: 899, img: "/static/images/placeholder-shop.jpg", shopId: 2, desc: "Noise cancelling" }
];

// Render products grid (on shop_detail page)
function loadProductsForShop(shopId) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    const filtered = products.filter(p => p.shopId == shopId);
    if (!filtered.length) {
        productGrid.innerHTML = "<p>No products found for this shop.</p>";
        return;
    }
    filtered.forEach(p => {
        productGrid.insertAdjacentHTML('beforeend', `
            <div class="product-card">
                <img src="${p.img}">
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <p><strong>Price:</strong> ₹${p.price.toLocaleString()}</p>
                <button class="btn-secondary" onclick="addToCompare(${p.id})">Compare</button>
            </div>
        `);
    });
}

// createProduct used by add_product.html
function createProduct() {
    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const shopId = parseInt(document.getElementById("productShop").value);
    const category = document.getElementById("productCategory").value;
    const desc = document.getElementById("productDescription").value.trim();

    if (!name || isNaN(price) || !shopId) {
        alert("Please fill name, price, and shop.");
        return;
    }

    const newId = products.length ? (Math.max(...products.map(p => p.id)) + 1) : 1;
    const imgPath = "/static/images/placeholder-shop.jpg";

    const product = { id: newId, name, price, img: imgPath, shopId, category, desc };
    products.push(product);

    alert("Product added (frontend only).");
    document.getElementById("addProductForm").reset();

    // If productGrid exists on current page for same shop, reload
    if (productGrid) {
        // if shop_detail page has #shopId element present, reload with that id
        const shopHeader = document.getElementById("shopName");
        if (shopHeader && shopHeader.dataset && shopHeader.dataset.shopId) {
            loadProductsForShop(parseInt(shopHeader.dataset.shopId));
        }
    }

    // Also re-populate compare selects
    populateCompareSelects();
}

// Compare helpers
function populateCompareSelects() {
    if (!compareA || !compareB) return;
    compareA.innerHTML = "";
    compareB.innerHTML = "";
    products.forEach(p => {
        const optA = document.createElement('option');
        optA.value = p.id;
        optA.textContent = `${p.name} - ₹${p.price.toLocaleString()}`;
        compareA.appendChild(optA);

        const optB = document.createElement('option');
        optB.value = p.id;
        optB.textContent = `${p.name} - ₹${p.price.toLocaleString()}`;
        compareB.appendChild(optB);
    });
}

function compareSelected() {
    const idA = parseInt(compareA.value);
    const idB = parseInt(compareB.value);
    if (!idA || !idB || idA === idB) {
        alert("Select two different products to compare.");
        return;
    }
    const A = products.find(p => p.id === idA);
    const B = products.find(p => p.id === idB);
    const resultDiv = document.getElementById("compareResult");

    resultDiv.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
            <tr style="background:#fafafa;">
                <th style="padding:12px; text-align:left;">Feature</th>
                <th style="padding:12px; text-align:left;">${A.name}</th>
                <th style="padding:12px; text-align:left;">${B.name}</th>
            </tr>
            <tr>
                <td style="padding:12px;">Price</td>
                <td style="padding:12px;">₹${A.price.toLocaleString()}</td>
                <td style="padding:12px;">₹${B.price.toLocaleString()}</td>
            </tr>
            <tr>
                <td style="padding:12px;">Description</td>
                <td style="padding:12px;">${A.desc}</td>
                <td style="padding:12px;">${B.desc}</td>
            </tr>
            <tr>
                <td style="padding:12px;">Shop</td>
                <td style="padding:12px;">${getShopName(A.shopId)}</td>
                <td style="padding:12px;">${getShopName(B.shopId)}</td>
            </tr>
        </table>
    `;
}

// small helper to get shop name (reads shops array from shops.js)
function getShopName(shopId) {
    if (window.shops && Array.isArray(window.shops)) {
        const s = window.shops.find(x => x.id === shopId);
        return s ? s.name : "Unknown Shop";
    }
    return "Unknown Shop";
}

// allow quick add to compare via product card button
function addToCompare(pid) {
    // set selected option A if empty, else B
    if (!compareA || !compareB) return;
    if (!compareA.value) {
        compareA.value = pid;
    } else if (!compareB.value && compareA.value != pid) {
        compareB.value = pid;
    } else {
        // both selected: replace B
        compareB.value = pid;
    }
}

// Expose functions globally
window.loadProductsForShop = loadProductsForShop;
window.createProduct = createProduct;
window.populateCompareSelects = populateCompareSelects;
window.compareSelected = compareSelected;
window.addToCompare = addToCompare;

// On DOM ready populate compare selects
document.addEventListener('DOMContentLoaded', function(){
    populateCompareSelects();
});
