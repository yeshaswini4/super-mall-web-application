from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Shop, Category, Floor
from .serializers import ShopSerializer, CategorySerializer, FloorSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.filter(is_active=True)
    serializer_class = ShopSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def floors(request):
    floors = Floor.objects.all()
    serializer = FloorSerializer(floors, many=True)
    return Response(serializer.data)