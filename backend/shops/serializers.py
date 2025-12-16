from rest_framework import serializers
from .models import Shop, Category, Floor

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class FloorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Floor
        fields = '__all__'

class ShopSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    floor_name = serializers.CharField(source='floor.name', read_only=True)
    
    class Meta:
        model = Shop
        fields = ['id', 'name', 'description', 'category', 'category_name', 'floor', 'floor_name', 'image_url', 'location', 'is_active']