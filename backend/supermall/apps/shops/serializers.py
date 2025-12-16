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
    category = CategorySerializer(read_only=True)
    floor = FloorSerializer(read_only=True)
    
    class Meta:
        model = Shop
        fields = '__all__'