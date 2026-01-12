from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum
from .models import Cart, Wishlist, Order, OrderItem
from .serializers import CartSerializer, WishlistSerializer, OrderSerializer
from products.models import Product

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Order.objects.all()
        elif self.request.user.role == 'merchant':
            return Order.objects.filter(items__product__shop__merchant=self.request.user).distinct()
        else:
            return Order.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    cart_item, created = Cart.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += int(quantity)
        cart_item.save()
    
    return Response(CartSerializer(cart_item).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get('product_id')
    
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user,
        product=product
    )
    
    return Response(WishlistSerializer(wishlist_item).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_from_cart(request):
    billing_details = request.data.get('billing_details', {})
    cart_items_data = request.data.get('cart_items', [])
    
    # If cart_items provided in request, use them; otherwise get from database
    if cart_items_data:
        # Frontend cart items
        if not cart_items_data:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate total from frontend cart
        total_amount = 0
        order_items_to_create = []
        
        for item_data in cart_items_data:
            try:
                product = Product.objects.get(id=item_data['id'], is_active=True)
                item_price = float(item_data.get('price', product.price))
                quantity = int(item_data.get('quantity', 1))
                total_amount += item_price * quantity
                
                order_items_to_create.append({
                    'product': product,
                    'quantity': quantity,
                    'price': item_price
                })
            except Product.DoesNotExist:
                return Response({'error': f'Product {item_data.get("name", "")} not found'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Database cart items
        cart_items = Cart.objects.filter(user=request.user)
        
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate total from database cart
        total_amount = sum(item.product.price * item.quantity for item in cart_items)
        order_items_to_create = [{
            'product': item.product,
            'quantity': item.quantity,
            'price': item.product.price
        } for item in cart_items]
    
    # Create order
    order = Order.objects.create(
        user=request.user,
        total_amount=total_amount,
        status='pending'
    )
    
    # Create order items
    for item_data in order_items_to_create:
        OrderItem.objects.create(
            order=order,
            product=item_data['product'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
    
    # Clear database cart if it was used
    if not request.data.get('cart_items'):
        Cart.objects.filter(user=request.user).delete()
    
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_summary(request):
    user_orders = Order.objects.filter(user=request.user)
    
    summary = {
        'total_orders': user_orders.count(),
        'total_spent': user_orders.aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
        'pending_orders': user_orders.filter(status='pending').count(),
        'completed_orders': user_orders.filter(status='delivered').count(),
    }
    
    return Response(summary)