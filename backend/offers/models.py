from django.db import models
from shops.models import Shop
from products.models import Product

class Offer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount_percentage = models.IntegerField()
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.discount_percentage}% off"