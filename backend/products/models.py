from django.db import models
from shops.models import Shop

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='products')
    category = models.CharField(max_length=100)
    image_url = models.URLField()
    stock_quantity = models.IntegerField(default=0)
    features = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.shop.name}"