const API_BASE_URL = 'http://localhost:8000/api';
const USER_ROLES = { ADMIN: 'admin', MERCHANT: 'merchant', CUSTOMER: 'customer' };

// Mock Data
window.MOCK_SHOPS = [
    { id: 1, name: 'Tech World Electronics', category: 'electronics', floor: '2', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    { id: 2, name: 'Fresh Mart Grocery', category: 'grocery', floor: 'ground', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
    { id: 3, name: 'Royal Fashion Store', category: 'fashion', floor: '1', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400' }
];

window.MOCK_PRODUCTS = [
    { id: 1, shopId: 1, name: 'iPhone 15 Pro', price: 999, category: 'electronics', features: ['A17 Pro Chip', '256GB Storage', '5G Network', 'ProMotion Display'], image: 'https://images.unsplash.com/photo-1592286927505-c0d0e0c5d0e0?w=400', stock: 10 },
    { id: 2, shopId: 1, name: 'Samsung Galaxy S24', price: 899, category: 'electronics', features: ['Snapdragon 8 Gen 3', '512GB Storage', '5G Network', '120Hz Display'], image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', stock: 15 },
    { id: 3, shopId: 1, name: 'MacBook Pro M3', price: 1999, category: 'electronics', features: ['M3 Chip', '16GB RAM', '512GB SSD', 'Retina Display'], image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', stock: 8 },
    { id: 4, shopId: 2, name: 'Organic Apples', price: 5, category: 'grocery', features: ['Fresh', 'Organic', '1kg Pack', 'Locally Sourced'], image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', stock: 50 },
    { id: 5, shopId: 2, name: 'Whole Wheat Bread', price: 3, category: 'grocery', features: ['Whole Grain', 'No Preservatives', '500g', 'Fresh Daily'], image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', stock: 30 },
    { id: 6, shopId: 3, name: 'Nike Air Max', price: 120, category: 'fashion', features: ['Size 10', 'Running Shoes', 'Air Cushioning', 'Breathable Mesh'], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 20 },
    { id: 7, shopId: 3, name: 'Levi\'s Jeans', price: 80, category: 'fashion', features: ['Slim Fit', '32x34', 'Stretch Denim', 'Classic Blue'], image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', stock: 25 }
];
