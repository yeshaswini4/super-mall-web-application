from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.db.models import Count, Sum
from django.utils import timezone
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .models import User
from shops.models import Shop
from products.models import Product
from orders.models import Order, Cart, Wishlist

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        login(request, user)
        return Response(UserSerializer(user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@ensure_csrf_cookie
def profile(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    stats = {
        'total_shops': Shop.objects.count(),
        'total_products': Product.objects.count(),
        'total_users': User.objects.count(),
        'total_orders': Order.objects.count(),
        'total_revenue': Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
        'orders_today': Order.objects.filter(created_at__date=timezone.now().date()).count(),
        'active_shops': Shop.objects.filter(is_active=True).count(),
        'recent_orders': Order.objects.select_related('user').order_by('-created_at')[:5].values(
            'id', 'user__username', 'total_amount', 'status', 'created_at'
        )
    }
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def merchant_stats(request):
    if request.user.role != 'merchant':
        return Response({'error': 'Merchant access required'}, status=status.HTTP_403_FORBIDDEN)
    
    merchant_shops = Shop.objects.filter(merchant=request.user)
    merchant_products = Product.objects.filter(shop__merchant=request.user)
    
    stats = {
        'total_shops': merchant_shops.count(),
        'total_products': merchant_products.count(),
        'active_products': merchant_products.filter(is_active=True).count(),
        'total_orders': Order.objects.filter(items__product__shop__merchant=request.user).distinct().count(),
        'revenue_today': 0,  # Calculate based on orders
        'shop_views': 0,  # Placeholder for analytics
        'recent_products': merchant_products.order_by('-created_at')[:5].values(
            'id', 'name', 'price', 'stock_quantity', 'created_at'
        )
    }
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_stats(request):
    if request.user.role not in ['customer', 'admin']:
        return Response({'error': 'Customer access required'}, status=status.HTTP_403_FORBIDDEN)
    
    user_orders = Order.objects.filter(user=request.user)
    user_cart = Cart.objects.filter(user=request.user)
    user_wishlist = Wishlist.objects.filter(user=request.user)
    
    stats = {
        'total_orders': user_orders.count(),
        'cart_items': user_cart.count(),
        'wishlist_items': user_wishlist.count(),
        'total_spent': user_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
        'recent_orders': user_orders.order_by('-created_at')[:3].values(
            'id', 'total_amount', 'status', 'created_at'
        )
    }
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_users(request):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all().values(
        'id', 'username', 'email', 'role', 'is_active', 'date_joined'
    )
    return Response(list(users))