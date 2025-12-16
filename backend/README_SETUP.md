# SuperMall Setup Guide

## Quick Start

1. **Run the application:**
   ```bash
   # Double-click setup_and_run.bat or run in terminal:
   setup_and_run.bat
   ```

2. **Access the application:**
   - Frontend: http://127.0.0.1:8000/
   - Admin Panel: http://127.0.0.1:8000/admin/
   - API: http://127.0.0.1:8000/api/

## Manual Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py populate_data
python manage.py runserver 127.0.0.1:8000
```

### Default Users
- **Admin:** username: `admin`, password: `admin123`
- **Merchants:** username: `shop_name` (e.g., `max_fashion`), password: `merchant123`

## API Endpoints

### Authentication
- POST `/api/auth/login/` - Login
- POST `/api/auth/register/` - Register
- POST `/api/auth/logout/` - Logout
- GET `/api/auth/profile/` - Get user profile

### Shops
- GET `/api/shops/` - List all shops
- GET `/api/shops/category/{category}/` - Shops by category
- GET `/api/shops/floor/{floor}/` - Shops by floor

### Products
- GET `/api/products/` - List all products
- GET `/api/products/shop/{shop_id}/` - Products by shop
- GET `/api/products/category/{category}/` - Products by category

### Cart & Wishlist
- GET `/api/orders/cart/` - Get user cart
- POST `/api/orders/add-to-cart/` - Add to cart
- GET `/api/orders/wishlist/` - Get user wishlist
- POST `/api/orders/add-to-wishlist/` - Add to wishlist

### Offers
- GET `/api/offers/` - List active offers

## Database Schema

The SQLite database (`db.sqlite3`) contains:
- **Users** - Customer, Merchant, Admin accounts
- **Categories** - Fashion, Grocery, Electronics, etc.
- **Floors** - Ground, First, Second floors
- **Shops** - 10+ sample shops with merchants
- **Products** - 40+ sample products across shops
- **Cart/Wishlist** - User shopping data
- **Offers** - Discount and promotion data

## Features Working

✅ **Backend Integration**
- Django REST API with SQLite database
- User authentication with sessions
- CRUD operations for all models
- Admin panel for data management

✅ **Frontend Integration**
- API service connecting to Django backend
- Real-time cart and wishlist updates
- User authentication state management
- Dynamic content loading from database

✅ **Sample Data**
- 10+ shops across 6 categories
- 40+ products with realistic pricing
- User accounts (admin, merchants)
- Active offers and discounts

## Next Steps

1. **Test the application** - Browse shops, add to cart, register users
2. **Admin panel** - Manage shops, products, users at `/admin/`
3. **Customize data** - Add more shops/products via admin or API
4. **Deploy** - Ready for cloud deployment with minimal changes