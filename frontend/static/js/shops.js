// static/js/shops.js

// DOM helper references (some pages may not have these elements, check before using)
const shopGrid = document.getElementById("shopGrid");
const shopSelectForProduct = document.getElementById("productShop");

// MOCK shops data (frontend-only)
let shops = [
    { id: 1, name: "Indian Electronics", category: "electronics", floor: 1, img: "/static/images/placeholder-shop.jpg", description: "Gadgets & accessories" },
    { id: 2, name: "Fresh Mart", category: "grocery", floor: 2, img: "/static/images/placeholder-shop.jpg", description: "Organic groceries" },
    { id: 3, name: "Royal Fashion", category: "fashion", floor: 1, img: "/static/images/placeholder-shop.jpg", description: "Clothes & accessories" }
];

// Render shops into grid (if shopGrid exists)
function loadShops(data) {
    if (!shopGrid) return;
    shopGrid.innerHTML = "";
    data.forEach(shop => {
        const html = `
            <div class="shop-card">
                <img src="${shop.img}">
                <h3>${shop.name}</h3>
                <p>${shop.description}</p>
                <p><strong>Category:</strong> ${shop.category} &nbsp; <strong>Floor:</strong> ${shop.floor}</p>
                <a href="/shop-detail/${shop.id}" class="btn-secondary">View Shop</a>
            </div>
        `;
        shopGrid.insertAdjacentHTML('beforeend', html);
    });
}

// Populate shop select for add product form
function populateShopSelect() {
    if (!shopSelectForProduct) return;
    shopSelectForProduct.innerHTML = "";
    shops.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (Floor ${s.floor})`;
        shopSelectForProduct.appendChild(opt);
    });
}

// createShop: called by add_shop.html
function createShop() {
    const name = document.getElementById("shopName").value.trim();
    const category = document.getElementById("shopCategory").value;
    const floor = document.getElementById("shopFloor").value;
    const location = document.getElementById("shopLocation").value.trim();
    const description = document.getElementById("shopDescription").value.trim();
    const imageInput = document.getElementById("shopImage");

    if (!name) {
        alert("Please enter shop name");
        return;
    }

    // For frontend demo we just create a new id and use placeholder image
    const newId = shops.length ? (Math.max(...shops.map(s => s.id)) + 1) : 1;
    const imgPath = "/static/images/placeholder-shop.jpg";

    const shop = {
        id: newId,
        name,
        category,
        floor: parseInt(floor),
        location,
        description,
        img: imgPath
    };

    shops.push(shop);
    populateShopSelect();
    // If shopGrid exists, reload view
    if (shopGrid) loadShops(shops);

    // simple feedback and reset form
    alert("Shop created (frontend only).");
    document.getElementById("addShopForm").reset();
}

// filterShops: same as earlier, kept for shop_list page
function filterShops() {
    const catElem = document.getElementById("categoryFilter");
    const floorElem = document.getElementById("floorFilter");
    const cat = catElem ? catElem.value : "all";
    const floor = floorElem ? floorElem.value : "all";

    const filtered = shops.filter(s =>
        (cat === "all" || s.category === cat) &&
        (floor === "all" || s.floor == floor)
    );
    loadShops(filtered);
}

// Expose functions to global so HTML can call them (for simple pages)
window.loadShops = loadShops;
window.createShop = createShop;
window.filterShops = filterShops;
window.populateShopSelect = populateShopSelect;

// initial populate when script loads
document.addEventListener("DOMContentLoaded", function(){
    populateShopSelect();
    // If on shops page, auto load all shops
    if (shopGrid) loadShops(shops);
});
