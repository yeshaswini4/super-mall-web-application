from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from shops.models import Shop

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        if self.request.user.is_authenticated and self.request.user.role == 'merchant':
            # Merchants can only see their own products
            queryset = queryset.filter(shop__merchant=self.request.user)
        return queryset
    
    def perform_create(self, serializer):
        if self.request.user.role == 'merchant':
            # Auto-assign to merchant's shop
            merchant_shop = Shop.objects.filter(merchant=self.request.user).first()
            if merchant_shop:
                serializer.save(shop=merchant_shop)
            else:
                raise ValueError("Merchant must have a shop to add products")
        else:
            serializer.save()

@api_view(['GET'])
def products_by_shop(request, shop_id):
    products = Product.objects.filter(shop_id=shop_id, is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def products_by_category(request, category):
    products = Product.objects.filter(category__iexact=category, is_active=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def merchant_products(request):
    if request.user.role != 'merchant':
        return Response({'error': 'Merchant access required'}, status=status.HTTP_403_FORBIDDEN)
    
    products = Product.objects.filter(shop__merchant=request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)