from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from shops.models import Shop

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            # Admins can see all products
            return Product.objects.all()
        elif self.request.user.is_authenticated and self.request.user.role == 'merchant':
            # Merchants can see their own products (both active and pending)
            return Product.objects.filter(shop__merchant=self.request.user)
        else:
            # Regular users only see active products
            return Product.objects.filter(is_active=True)
    
    def perform_create(self, serializer):
        if self.request.user.role == 'merchant':
            # Auto-assign to merchant's shop and set as pending
            merchant_shop = Shop.objects.filter(merchant=self.request.user).first()
            if merchant_shop:
                serializer.save(shop=merchant_shop, is_active=False)  # Pending approval
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_products(request):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    products = Product.objects.filter(is_active=False)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_product(request, product_id):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        product = Product.objects.get(id=product_id)
        product.is_active = True
        product.save()
        return Response({'message': 'Product approved successfully'})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_product(request, product_id):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        product = Product.objects.get(id=product_id)
        product.delete()  # Or you could set a rejected flag instead
        return Response({'message': 'Product rejected successfully'})
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)