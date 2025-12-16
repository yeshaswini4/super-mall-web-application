from rest_framework import viewsets
from django.utils import timezone
from .models import Offer
from .serializers import OfferSerializer

class OfferViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OfferSerializer
    
    def get_queryset(self):
        return Offer.objects.filter(
            is_active=True,
            valid_from__lte=timezone.now(),
            valid_to__gte=timezone.now()
        )