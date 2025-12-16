from rest_framework import serializers
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    shop_name = serializers.CharField(source='shop.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = Offer
        fields = ['id', 'title', 'description', 'discount_percentage', 'shop', 'shop_name', 'product', 'product_name', 'valid_from', 'valid_to', 'is_active']