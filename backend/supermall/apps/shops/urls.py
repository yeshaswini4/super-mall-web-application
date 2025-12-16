from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ShopViewSet)

urlpatterns = [
    path('categories/', views.categories, name='categories'),
    path('floors/', views.floors, name='floors'),
    path('', include(router.urls)),
]