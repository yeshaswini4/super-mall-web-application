from django.core.management.base import BaseCommand
from django.utils import timezone
from orders.models import Order

class Command(BaseCommand):
    help = 'Mark orders as delivered after 2 days'

    def handle(self, *args, **options):
        now = timezone.now()
        orders_to_deliver = Order.objects.filter(
            estimated_delivery__lte=now,
            status__in=['pending', 'confirmed', 'shipped']
        )
        
        count = orders_to_deliver.update(status='delivered', delivered_at=now)
        self.stdout.write(f'Marked {count} orders as delivered')