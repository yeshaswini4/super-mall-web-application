#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supermall.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Product
from shops.models import Shop, Category, Floor

User = get_user_model()

def create_test_products():
    print("Creating test products for approval system...")
    
    # Get or create a merchant user
    merchant_user, created = User.objects.get_or_create(
        username='test_merchant',
        defaults={
            'email': 'merchant@test.com',
            'role': 'merchant',
            'is_active': True
        }
    )
    if created:
        merchant_user.set_password('test123')
        merchant_user.save()
        print(f"Created merchant user: {merchant_user.username}")
    
    # Get or create category and floor
    category, _ = Category.objects.get_or_create(
        name='Electronics',
        defaults={'icon': '📱'}
    )
    
    floor, _ = Floor.objects.get_or_create(
        number=1,
        defaults={'name': 'Ground Floor'}
    )
    
    # Get or create a shop for the merchant
    shop, created = Shop.objects.get_or_create(
        name="Test Merchant Shop",
        defaults={
            'merchant': merchant_user,
            'category': category,
            'floor': floor,
            'description': 'A test shop for demonstrating the approval system',
            'location': 'Section A',
            'image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
            'is_active': True
        }
    )
    if created:
        print(f"Created shop: {shop.name}")
    
    # Create test products (pending approval)
    test_products = [
        {
            'name': 'iPhone 15 Pro Max',
            'description': 'Latest iPhone with advanced features and excellent camera quality.',
            'price': 129999.00,
            'category': 'electronics',
            'image_url': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
            'stock_quantity': 25,
            'is_active': False  # Pending approval
        },
        {
            'name': 'Samsung Galaxy S24 Ultra',
            'description': 'Premium Android smartphone with S Pen and amazing display.',
            'price': 119999.00,
            'category': 'electronics',
            'image_url': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
            'stock_quantity': 30,
            'is_active': False  # Pending approval
        },
        {
            'name': 'MacBook Pro M3',
            'description': 'Powerful laptop for professionals with M3 chip and Retina display.',
            'price': 199999.00,
            'category': 'electronics',
            'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            'stock_quantity': 15,
            'is_active': False  # Pending approval
        },
        {
            'name': 'Sony WH-1000XM5 Headphones',
            'description': 'Premium noise-canceling wireless headphones with excellent sound quality.',
            'price': 29999.00,
            'category': 'electronics',
            'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            'stock_quantity': 50,
            'is_active': False  # Pending approval
        },
        {
            'name': 'iPad Air 5th Gen',
            'description': 'Versatile tablet perfect for work, creativity, and entertainment.',
            'price': 59999.00,
            'category': 'electronics',
            'image_url': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            'stock_quantity': 20,
            'is_active': False  # Pending approval
        }
    ]
    
    created_count = 0
    for product_data in test_products:
        product, created = Product.objects.get_or_create(
            name=product_data['name'],
            shop=shop,
            defaults=product_data
        )
        if created:
            created_count += 1
            print(f"Created pending product: {product.name} (ID: {product.id})")
    
    print(f"\nSummary:")
    print(f"- Total products in database: {Product.objects.count()}")
    print(f"- Pending products: {Product.objects.filter(is_active=False).count()}")
    print(f"- Active products: {Product.objects.filter(is_active=True).count()}")
    print(f"- New products created: {created_count}")
    
    print(f"\nTest merchant credentials:")
    print(f"Username: {merchant_user.username}")
    print(f"Email: {merchant_user.email}")
    print(f"Password: test123")
    
    print(f"\nYou can now:")
    print(f"1. Login as admin (yeshaswini234@gmail.com / yesh123)")
    print(f"2. Go to Admin Dashboard")
    print(f"3. Check 'Product Approvals' section")
    print(f"4. Approve/reject the pending products")

if __name__ == '__main__':
    create_test_products()