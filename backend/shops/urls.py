from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'list', views.ShopViewSet, basename='shop')
router.register(r'categories', views.CategoryViewSet)
router.register(r'floors', views.FloorViewSet)

urlpatterns = [
    path('category/<str:category_name>/', views.shops_by_category, name='shops_by_category'),
    path('floor/<int:floor_number>/', views.shops_by_floor, name='shops_by_floor'),
    path('merchant/', views.merchant_shops, name='merchant_shops'),
    path('', include(router.urls)),
]