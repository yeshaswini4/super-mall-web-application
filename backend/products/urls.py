from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'list', views.ProductViewSet, basename='product')

urlpatterns = [
    path('shop/<int:shop_id>/', views.products_by_shop, name='products_by_shop'),
    path('category/<str:category>/', views.products_by_category, name='products_by_category'),
    path('merchant/', views.merchant_products, name='merchant_products'),
    path('', include(router.urls)),
]