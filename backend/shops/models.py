from django.db import models
from accounts.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10)
    
    def __str__(self):
        return self.name

class Floor(models.Model):
    number = models.IntegerField()
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return f"Floor {self.number} - {self.name}"

class Shop(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    merchant = models.ForeignKey(User, on_delete=models.CASCADE)
    image_url = models.URLField()
    location = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name