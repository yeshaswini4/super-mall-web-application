from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from shops.models import Shop, Category, Floor
from products.models import Product
from orders.models import Order, OrderItem, Cart, Wishlist
from offers.models import Offer
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with comprehensive sample data'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Starting comprehensive data population...')
        
        # Create users
        self.create_users()
        
        # Create categories and floors
        self.create_categories_and_floors()
        
        # Create shops
        self.create_shops()
        
        # Create products
        self.create_products()
        
        # Create orders
        self.create_orders()
        
        # Create offers
        self.create_offers()
        
        # Create cart and wishlist items
        self.create_cart_wishlist()
        
        self.stdout.write(self.style.SUCCESS('✅ Database populated successfully!'))
        self.stdout.write('📊 Summary:')
        self.stdout.write(f'   Users: {User.objects.count()}')
        self.stdout.write(f'   Shops: {Shop.objects.count()}')
        self.stdout.write(f'   Products: {Product.objects.count()}')
        self.stdout.write(f'   Orders: {Order.objects.count()}')
        self.stdout.write(f'   Offers: {Offer.objects.count()}')

    def create_users(self):
        self.stdout.write('👥 Creating users...')
        
        # Admin user
        if not User.objects.filter(username='yeshaswini').exists():
            User.objects.create_superuser(
                username='yeshaswini',
                email='yeshaswini234@gmail.com',
                password='premaganesh',
                first_name='Yeshaswini',
                last_name='Admin',
                role='admin'
            )
        
        # Merchant users
        merchants = [
            {'username': 'merchant1', 'email': 'merchant1@supermall.com', 'first_name': 'John', 'last_name': 'Merchant'},
            {'username': 'merchant2', 'email': 'merchant2@supermall.com', 'first_name': 'Jane', 'last_name': 'Shop'},
            {'username': 'merchant3', 'email': 'merchant3@supermall.com', 'first_name': 'Mike', 'last_name': 'Store'},
        ]
        
        for merchant_data in merchants:
            if not User.objects.filter(username=merchant_data['username']).exists():
                User.objects.create_user(
                    password='merchant123',
                    role='merchant',
                    **merchant_data
                )
        
        # Customer users
        customers = [
            {'username': 'customer1', 'email': 'customer1@example.com', 'first_name': 'Alice', 'last_name': 'Johnson'},
            {'username': 'customer2', 'email': 'customer2@example.com', 'first_name': 'Bob', 'last_name': 'Smith'},
            {'username': 'customer3', 'email': 'customer3@example.com', 'first_name': 'Carol', 'last_name': 'Davis'},
        ]
        
        for customer_data in customers:
            if not User.objects.filter(username=customer_data['username']).exists():
                User.objects.create_user(
                    password='customer123',
                    role='customer',
                    **customer_data
                )

    def create_categories_and_floors(self):
        self.stdout.write('🏷️ Creating categories and floors...')
        
        categories = [
            {'name': 'Electronics', 'icon': '📱'},
            {'name': 'Fashion', 'icon': '👗'},
            {'name': 'Home & Kitchen', 'icon': '🏠'},
            {'name': 'Beauty', 'icon': '💄'},
            {'name': 'Grocery', 'icon': '🛒'},
            {'name': 'Toys', 'icon': '🎨'},
        ]
        
        for cat_data in categories:
            Category.objects.get_or_create(**cat_data)
        
        floors = [
            {'number': 1, 'name': 'Ground Floor - Fashion & Beauty'},
            {'number': 2, 'name': 'First Floor - Electronics & Home'},
            {'number': 3, 'name': 'Second Floor - Grocery & Toys'},
        ]
        
        for floor_data in floors:
            Floor.objects.get_or_create(**floor_data)

    def create_shops(self):
        self.stdout.write('🏪 Creating shops...')
        
        merchants = User.objects.filter(role='merchant')
        categories = Category.objects.all()
        floors = Floor.objects.all()
        
        shops_data = [
            {
                'name': 'Max Fashion',
                'description': 'Trendy fashion for all ages',
                'category': categories.get(name='Fashion'),
                'floor': floors.get(number=1),
                'merchant': merchants[0] if merchants else User.objects.filter(role='admin').first(),
                'image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
                'location': 'Shop 101, Ground Floor'
            },
            {
                'name': 'Croma Electronics',
                'description': 'Latest gadgets and electronics',
                'category': categories.get(name='Electronics'),
                'floor': floors.get(number=2),
                'merchant': merchants[1] if len(merchants) > 1 else User.objects.filter(role='admin').first(),
                'image_url': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
                'location': 'Shop 201, First Floor'
            },
            {
                'name': 'Fresh Basket',
                'description': 'Fresh groceries and daily essentials',
                'category': categories.get(name='Grocery'),
                'floor': floors.get(number=3),
                'merchant': merchants[2] if len(merchants) > 2 else User.objects.filter(role='admin').first(),
                'image_url': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
                'location': 'Shop 301, Second Floor'
            },
            {
                'name': 'Beauty World',
                'description': 'Premium beauty and skincare products',
                'category': categories.get(name='Beauty'),
                'floor': floors.get(number=1),
                'merchant': merchants[0] if merchants else User.objects.filter(role='admin').first(),
                'image_url': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
                'location': 'Shop 102, Ground Floor'
            },
            {
                'name': 'Home Centre',
                'description': 'Everything for your home',
                'category': categories.get(name='Home & Kitchen'),
                'floor': floors.get(number=2),
                'merchant': merchants[1] if len(merchants) > 1 else User.objects.filter(role='admin').first(),
                'image_url': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
                'location': 'Shop 202, First Floor'
            },
            {
                'name': 'Toy Planet',
                'description': 'Fun toys and games for kids',
                'category': categories.get(name='Toys'),
                'floor': floors.get(number=3),
                'merchant': merchants[2] if len(merchants) > 2 else User.objects.filter(role='admin').first(),
                'image_url': 'https://images.unsplash.com/photo-1558877385-1c2b2c2e8e8e?w=400',
                'location': 'Shop 302, Second Floor'
            },
        ]
        
        for shop_data in shops_data:
            Shop.objects.get_or_create(
                name=shop_data['name'],
                defaults=shop_data
            )

    def create_products(self):
        self.stdout.write('📦 Creating products...')
        
        shops = Shop.objects.all()
        
        products_data = [
            # Electronics
            {'name': 'iPhone 15 Pro Max', 'price': Decimal('129999'), 'category': 'electronics', 'stock_quantity': 50},
            {'name': 'Samsung Galaxy S24 Ultra', 'price': Decimal('119999'), 'category': 'electronics', 'stock_quantity': 45},
            {'name': 'MacBook Pro M3', 'price': Decimal('199999'), 'category': 'electronics', 'stock_quantity': 25},
            {'name': 'Sony WH-1000XM5', 'price': Decimal('29999'), 'category': 'electronics', 'stock_quantity': 100},
            
            # Fashion
            {'name': 'Nike Air Max 270', 'price': Decimal('12999'), 'category': 'fashion', 'stock_quantity': 75},
            {'name': 'Adidas Ultraboost 22', 'price': Decimal('15999'), 'category': 'fashion', 'stock_quantity': 60},
            {'name': 'Levi\'s 501 Jeans', 'price': Decimal('4999'), 'category': 'fashion', 'stock_quantity': 120},
            {'name': 'H&M Cotton T-Shirt', 'price': Decimal('999'), 'category': 'fashion', 'stock_quantity': 200},
            
            # Home & Kitchen
            {'name': 'KitchenAid Stand Mixer', 'price': Decimal('45999'), 'category': 'home', 'stock_quantity': 30},
            {'name': 'Dyson V15 Vacuum', 'price': Decimal('55999'), 'category': 'home', 'stock_quantity': 20},
            {'name': 'IKEA Sofa Set', 'price': Decimal('89999'), 'category': 'home', 'stock_quantity': 15},
            
            # Beauty
            {'name': 'Lakme Foundation', 'price': Decimal('1299'), 'category': 'beauty', 'stock_quantity': 150},
            {'name': 'L\'Oreal Shampoo', 'price': Decimal('599'), 'category': 'beauty', 'stock_quantity': 200},
            {'name': 'Maybelline Mascara', 'price': Decimal('899'), 'category': 'beauty', 'stock_quantity': 180},
            
            # Grocery
            {'name': 'Organic Apples (1kg)', 'price': Decimal('299'), 'category': 'grocery', 'stock_quantity': 500},
            {'name': 'Basmati Rice (5kg)', 'price': Decimal('899'), 'category': 'grocery', 'stock_quantity': 300},
            {'name': 'Olive Oil (500ml)', 'price': Decimal('599'), 'category': 'grocery', 'stock_quantity': 250},
            
            # Toys
            {'name': 'LEGO Creator Set', 'price': Decimal('4999'), 'category': 'toys', 'stock_quantity': 80},
            {'name': 'Barbie Doll House', 'price': Decimal('3499'), 'category': 'toys', 'stock_quantity': 60},
            {'name': 'Hot Wheels Track Set', 'price': Decimal('2999'), 'category': 'toys', 'stock_quantity': 90},
        ]
        
        for product_data in products_data:
            # Assign to appropriate shop based on category
            category_shop_map = {
                'electronics': 'Croma Electronics',
                'fashion': 'Max Fashion',
                'home': 'Home Centre',
                'beauty': 'Beauty World',
                'grocery': 'Fresh Basket',
                'toys': 'Toy Planet'
            }
            
            shop_name = category_shop_map.get(product_data['category'], 'Max Fashion')
            shop = shops.filter(name=shop_name).first() or shops.first()
            
            if shop:
                Product.objects.get_or_create(
                    name=product_data['name'],
                    shop=shop,
                    defaults={
                        'description': f'High quality {product_data["name"]} available at {shop.name}',
                        'price': product_data['price'],
                        'category': product_data['category'],
                        'stock_quantity': product_data['stock_quantity'],
                        'image_url': 'https://via.placeholder.com/300x200',
                        'features': {'brand': 'Premium', 'warranty': '1 year'}
                    }
                )

    def create_orders(self):
        self.stdout.write('📋 Creating sample orders...')
        
        customers = User.objects.filter(role='customer')
        products = Product.objects.all()
        
        if customers and products:
            for i in range(10):
                customer = random.choice(customers)
                order_products = random.sample(list(products), random.randint(1, 3))
                
                total_amount = sum(product.price * random.randint(1, 2) for product in order_products)
                
                order = Order.objects.create(
                    user=customer,
                    total_amount=total_amount,
                    status=random.choice(['pending', 'confirmed', 'shipped', 'delivered'])
                )
                
                for product in order_products:
                    quantity = random.randint(1, 2)
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price=product.price
                    )

    def create_offers(self):
        self.stdout.write('🎯 Creating offers...')
        
        offers_data = [
            {
                'title': 'Electronics Mega Sale',
                'description': 'Up to 70% off on all electronics',
                'discount_percentage': 70,
                'category': 'electronics',
                'is_active': True
            },
            {
                'title': 'Fashion Week Special',
                'description': 'Buy 2 Get 1 Free on fashion items',
                'discount_percentage': 50,
                'category': 'fashion',
                'is_active': True
            },
            {
                'title': 'Home Makeover Sale',
                'description': 'Transform your home with 60% off',
                'discount_percentage': 60,
                'category': 'home',
                'is_active': True
            }
        ]
        
        for offer_data in offers_data:
            Offer.objects.get_or_create(
                title=offer_data['title'],
                defaults=offer_data
            )

    def create_cart_wishlist(self):
        self.stdout.write('🛒 Creating cart and wishlist items...')
        
        customers = User.objects.filter(role='customer')
        products = Product.objects.all()
        
        if customers and products:
            for customer in customers[:2]:  # Only for first 2 customers
                # Add some cart items
                cart_products = random.sample(list(products), random.randint(1, 3))
                for product in cart_products:
                    Cart.objects.get_or_create(
                        user=customer,
                        product=product,
                        defaults={'quantity': random.randint(1, 3)}
                    )
                
                # Add some wishlist items
                wishlist_products = random.sample(list(products), random.randint(2, 5))
                for product in wishlist_products:
                    Wishlist.objects.get_or_create(
                        user=customer,
                        product=product
                    )