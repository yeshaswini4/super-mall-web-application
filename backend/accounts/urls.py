from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('csrf-token/', views.get_csrf_token, name='csrf_token'),
    path('admin-stats/', views.admin_stats, name='admin_stats'),
    path('merchant-stats/', views.merchant_stats, name='merchant_stats'),
    path('customer-stats/', views.customer_stats, name='customer_stats'),
    path('users/', views.all_users, name='all_users'),
]