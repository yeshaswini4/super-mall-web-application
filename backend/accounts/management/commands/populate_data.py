from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from shops.models import Category, Floor, Shop
from products.models import Product
from offers.models import Offer

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Create categories
        categories = [
            {'name': 'fashion', 'icon': '👗'},
            {'name': 'grocery', 'icon': '🛒'},
            {'name': 'electronics', 'icon': '📱'},
            {'name': 'home', 'icon': '🏠'},
            {'name': 'beauty', 'icon': '💄'},
            {'name': 'toys', 'icon': '🎨'},
        ]
        
        for cat_data in categories:
            Category.objects.get_or_create(**cat_data)
        
        # Create floors
        floors = [
            {'number': 1, 'name': 'Ground Floor'},
            {'number': 2, 'name': 'First Floor'},
            {'number': 3, 'name': 'Second Floor'},
        ]
        
        for floor_data in floors:
            Floor.objects.get_or_create(**floor_data)
        
        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='yeshaswini',
            defaults={
                'email': 'yeshaswini234@gmail.com',
                'first_name': 'Yeshaswini',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('yesh123')
            admin_user.save()
        
        # Create merchant users and shops
        shops_data = [
            {'name': 'Max Fashion', 'category': 'fashion', 'floor': 1, 'description': 'Trendy fashion for all ages'},
            {'name': 'Reliance Trends', 'category': 'fashion', 'floor': 1, 'description': 'Affordable fashion store'},
            {'name': 'Bata', 'category': 'fashion', 'floor': 1, 'description': 'Quality footwear since 1894'},
            {'name': 'Fresh Basket', 'category': 'grocery', 'floor': 2, 'description': 'Fresh groceries and daily needs'},
            {'name': 'Big Bazaar', 'category': 'grocery', 'floor': 2, 'description': 'One-stop shopping destination'},
            {'name': 'Croma', 'category': 'electronics', 'floor': 3, 'description': 'Electronics and gadgets'},
            {'name': 'Reliance Digital', 'category': 'electronics', 'floor': 3, 'description': 'Digital lifestyle store'},
            {'name': 'Home Centre', 'category': 'home', 'floor': 2, 'description': 'Home decor and furniture'},
            {'name': 'Health & Glow', 'category': 'beauty', 'floor': 1, 'description': 'Beauty and wellness products'},
            {'name': 'Toy Planet', 'category': 'toys', 'floor': 3, 'description': 'Toys and games for kids'},
        ]
        
        for shop_data in shops_data:
            # Create merchant user
            merchant_username = shop_data['name'].lower().replace(' ', '_')
            merchant, created = User.objects.get_or_create(
                username=merchant_username,
                defaults={
                    'email': f'{merchant_username}@supermall.com',
                    'first_name': shop_data['name'].split()[0],
                    'last_name': ' '.join(shop_data['name'].split()[1:]) if len(shop_data['name'].split()) > 1 else '',
                    'role': 'merchant'
                }
            )
            if created:
                merchant.set_password('merchant123')
                merchant.save()
            
            # Create shop
            category = Category.objects.get(name=shop_data['category'])
            floor = Floor.objects.get(number=shop_data['floor'])
            
            shop, created = Shop.objects.get_or_create(
                name=shop_data['name'],
                defaults={
                    'description': shop_data['description'],
                    'category': category,
                    'floor': floor,
                    'merchant': merchant,
                    'image_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
                    'location': f'Floor {shop_data["floor"]}, Section A'
                }
            )
            
            # Create sample products for each shop
            if shop_data['name'] == 'Max Fashion':
                products = [
                    {'name': 'Cotton T-Shirt', 'price': 599, 'category': 'clothing'},
                    {'name': 'Denim Jeans', 'price': 1299, 'category': 'clothing'},
                    {'name': 'Summer Dress', 'price': 899, 'category': 'clothing'},
                    {'name': 'Casual Shirt', 'price': 799, 'category': 'clothing'},
                ]
            elif shop_data['name'] == 'Fresh Basket':
                products = [
                    {'name': 'Organic Apples', 'price': 120, 'category': 'fruits'},
                    {'name': 'Fresh Milk', 'price': 60, 'category': 'dairy'},
                    {'name': 'Whole Wheat Bread', 'price': 40, 'category': 'bakery'},
                    {'name': 'Basmati Rice', 'price': 180, 'category': 'grains'},
                ]
            elif shop_data['name'] == 'Croma':
                products = [
                    {'name': 'Smartphone', 'price': 15999, 'category': 'mobile'},
                    {'name': 'Bluetooth Headphones', 'price': 2999, 'category': 'audio'},
                    {'name': 'Laptop', 'price': 45999, 'category': 'computer'},
                    {'name': 'Smart Watch', 'price': 8999, 'category': 'wearable'},
                ]
            else:
                products = [
                    {'name': f'{shop_data["name"]} Product 1', 'price': 299, 'category': 'general'},
                    {'name': f'{shop_data["name"]} Product 2', 'price': 599, 'category': 'general'},
                    {'name': f'{shop_data["name"]} Product 3', 'price': 899, 'category': 'general'},
                    {'name': f'{shop_data["name"]} Product 4', 'price': 1299, 'category': 'general'},
                ]
            
            for product_data in products:
                Product.objects.get_or_create(
                    name=product_data['name'],
                    shop=shop,
                    defaults={
                        'description': f'Quality {product_data["name"]} from {shop.name}',
                        'price': product_data['price'],
                        'category': product_data['category'],
                        'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                        'stock_quantity': 50,
                        'features': {'brand': shop.name, 'warranty': '1 year'}
                    }
                )
        
        # Create sample offers
        shops = Shop.objects.all()[:5]
        for shop in shops:
            Offer.objects.get_or_create(
                title=f'{shop.name} Special Offer',
                defaults={
                    'description': f'Get amazing discounts at {shop.name}',
                    'discount_percentage': 20,
                    'shop': shop,
                    'valid_from': timezone.now(),
                    'valid_to': timezone.now() + timedelta(days=30)
                }
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully populated database with sample data'))