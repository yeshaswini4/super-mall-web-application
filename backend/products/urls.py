from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'list', views.ProductViewSet, basename='product')

urlpatterns = [
    path('shop/<int:shop_id>/', views.products_by_shop, name='products_by_shop'),
    path('category/<str:category>/', views.products_by_category, name='products_by_category'),
    path('merchant/', views.merchant_products, name='merchant_products'),
    path('pending/', views.pending_products, name='pending_products'),
    path('<int:product_id>/approve/', views.approve_product, name='approve_product'),
    path('<int:product_id>/reject/', views.reject_product, name='reject_product'),
    path('', include(router.urls)),
]