from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Shop, Category, Floor
from .serializers import ShopSerializer, CategorySerializer, FloorSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.filter(is_active=True)
    serializer_class = ShopSerializer
    
    def get_queryset(self):
        queryset = Shop.objects.filter(is_active=True)
        if self.request.user.is_authenticated and self.request.user.role == 'merchant':
            # Merchants can only see their own shops
            queryset = queryset.filter(merchant=self.request.user)
        return queryset
    
    def perform_create(self, serializer):
        if self.request.user.role == 'merchant':
            serializer.save(merchant=self.request.user)
        else:
            serializer.save()

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def merchant_shops(request):
    if request.user.role != 'merchant':
        return Response({'error': 'Merchant access required'}, status=status.HTTP_403_FORBIDDEN)
    
    shops = Shop.objects.filter(merchant=request.user)
    serializer = ShopSerializer(shops, many=True)
    return Response(serializer.data)