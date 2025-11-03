from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.serializers.json import DjangoJSONEncoder

from backend.apps.catalog.models import Product
from backend.apps.addresses.models import Address


class Order(models.Model):
    STATUS = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("canceled", "Canceled"),
    ]

    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders"
    )
    status = models.CharField(max_length=12, choices=STATUS, default="pending")

    # Amounts
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Shipping address linkage (optional, we also snapshot values below)
    shipping_address = models.ForeignKey(
        Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    # Snapshot of address fields at purchase time (immutable record)
    shipping_snapshot = models.JSONField(
        encoder=DjangoJSONEncoder, default=dict, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def recalc_totals(self):
        subtotal = Decimal("0")
        for it in self.items.all():
            qty = Decimal(it.quantity or 0)
            price = Decimal(it.unit_price or 0)
            subtotal += qty * price
        self.subtotal = subtotal
        self.total = (self.subtotal or Decimal("0")) + (self.shipping or Decimal("0"))

    def snapshot_from_address(self, addr: Address):
        if not addr:
            self.shipping_snapshot = {}
            return
        self.shipping_address = addr
        self.shipping_snapshot = {
            "full_name": addr.full_name,
            "phone": addr.phone,
            "line1": addr.line1,
            "line2": addr.line2,
            "city": addr.city,
            "state": addr.state,
            "postal_code": addr.postal_code,
            "country": addr.country,
            "label": addr.label,
        }


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ("order", "id")
