class ProductManager {
    constructor() {
        this.products = window.MOCK_PRODUCTS || [];
        this.loadCompareList();
    }

    loadCompareList() {
        const saved = localStorage.getItem('compareList');
        this.compareList = saved ? JSON.parse(saved) : [];
    }

    saveCompareList() {
        localStorage.setItem('compareList', JSON.stringify(this.compareList));
    }

    async loadProducts(shopId = null) {
        this.products = window.MOCK_PRODUCTS || [];
        return shopId ? this.products.filter(p => p.shopId === shopId) : this.products;
    }

    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    addToCompare(productId) {
        if (this.compareList.length >= 4) {
            alert('Maximum 4 products can be compared');
            return false;
        }
        if (this.compareList.includes(productId)) {
            alert('Product already added');
            return false;
        }
        this.compareList.push(productId);
        this.saveCompareList();
        alert('Product added to comparison!');
        return true;
    }

    removeFromCompare(productId) {
        this.compareList = this.compareList.filter(id => id !== productId);
        this.saveCompareList();
    }

    getCompareProducts() {
        return this.compareList.map(id => this.getProduct(id)).filter(p => p);
    }

    clearCompare() {
        this.compareList = [];
        this.saveCompareList();
    }
}

const productManager = new ProductManager();
