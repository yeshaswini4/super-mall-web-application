from django.contrib import admin
from .models import Offer

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['title', 'discount_percentage', 'shop', 'product', 'valid_from', 'valid_to', 'is_active']
    list_filter = ['is_active', 'shop']