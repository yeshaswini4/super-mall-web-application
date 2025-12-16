// Shop Listing and Filtering
class ShopManager {
    constructor() {
        this.shops = [];
        this.filters = {
            category: null,
            floor: null,
            search: ''
        };
    }

    async loadShops() {
        // Mock data - replace with API call
        this.shops = [
            { id: 1, name: 'Tech World', category: 'electronics', floor: 'second', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', description: 'Latest gadgets' },
            { id: 2, name: 'Fashion Hub', category: 'fashion', floor: 'first', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', description: 'Trendy clothes' },
            { id: 3, name: 'Fresh Mart', category: 'grocery', floor: 'ground', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', description: 'Fresh groceries' },
            { id: 4, name: 'Home Decor', category: 'home', floor: 'first', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', description: 'Beautiful home items' }
        ];
        return this.shops;
    }

    filterShops() {
        let filtered = this.shops;

        if (this.filters.category) {
            filtered = filtered.filter(s => s.category === this.filters.category);
        }

        if (this.filters.floor) {
            filtered = filtered.filter(s => s.floor === this.filters.floor);
        }

        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(s => 
                s.name.toLowerCase().includes(search) || 
                s.description.toLowerCase().includes(search)
            );
        }

        return filtered;
    }

    setFilter(type, value) {
        this.filters[type] = value;
    }

    clearFilters() {
        this.filters = { category: null, floor: null, search: '' };
    }
}

const shopManager = new ShopManager();
