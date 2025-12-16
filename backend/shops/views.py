from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Shop, Category, Floor
from .serializers import ShopSerializer, CategorySerializer, FloorSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.filter(is_active=True)
    serializer_class = ShopSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class FloorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer

@api_view(['GET'])
def shops_by_category(request, category_name):
    shops = Shop.objects.filter(category__name__iexact=category_name, is_active=True)
    serializer = ShopSerializer(shops, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def shops_by_floor(request, floor_number):
    shops = Shop.objects.filter(floor__number=floor_number, is_active=True)
    serializer = ShopSerializer(shops, many=True)
    return Response(serializer.data)