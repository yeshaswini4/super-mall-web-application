from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

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