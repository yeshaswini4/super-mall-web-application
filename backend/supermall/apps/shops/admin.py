from django.contrib import admin
from .models import Shop, Category, Floor

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'created_at']

@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ['number', 'description']

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ['name', 'merchant', 'category', 'floor', 'is_active', 'created_at']
    list_filter = ['category', 'floor', 'is_active']
    search_fields = ['name', 'merchant__username']