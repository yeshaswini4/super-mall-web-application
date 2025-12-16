from django.contrib import admin
from .models import Shop, Category, Floor

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']

@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ['number', 'name']

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'floor', 'merchant', 'is_active']
    list_filter = ['category', 'floor', 'is_active']