from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    shop_name = serializers.CharField(source='shop.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'shop', 'shop_name', 'category', 'image_url', 'stock_quantity', 'features', 'is_active']