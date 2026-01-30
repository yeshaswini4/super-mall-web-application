import os
import django
import sys
from datetime import datetime, timedelta
from decimal import Decimal

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supermall.settings')
django.setup()

from accounts.models import User
from orders.models import Order, OrderItem
from products.models import Product

def create_test_orders():
    print("Creating test orders...")
    
    # Get or create a customer user
    customer, created = User.objects.get_or_create(
        email='customer@test.com',
        defaults={
            'username': 'testcustomer',
            'role': 'customer',
            'is_active': True
        }
    )
    if created:
        customer.set_password('test123')
        customer.save()
        print(f"Created customer: {customer.username}")
    
    # Get some products
    products = Product.objects.filter(is_active=True)[:3]
    if not products:
        print("No active products found. Please create some products first.")
        return
    
    # Create test orders
    orders_data = [
        {
            'total_amount': Decimal('2499.00'),
            'status': 'delivered',
            'created_at': datetime.now() - timedelta(days=7)
        },
        {
            'total_amount': Decimal('1299.00'),
            'status': 'shipped',
            'created_at': datetime.now() - timedelta(days=3)
        },
        {
            'total_amount': Decimal('3999.00'),
            'status': 'pending',
            'created_at': datetime.now() - timedelta(days=1)
        }
    ]
    
    for i, order_data in enumerate(orders_data):
        order = Order.objects.create(
            user=customer,
            total_amount=order_data['total_amount'],
            status=order_data['status'],
            created_at=order_data['created_at']
        )
        
        # Add order items
        if i < len(products):
            OrderItem.objects.create(
                order=order,
                product=products[i],
                quantity=1,
                price=products[i].price
            )
        
        print(f"Created order #{order.id} - {order.status} - Rs.{order.total_amount}")
    
    print(f"Created {len(orders_data)} test orders for customer: {customer.email}")

if __name__ == '__main__':
    create_test_orders()