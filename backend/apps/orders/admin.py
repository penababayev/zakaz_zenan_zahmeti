from decimal import Decimal

from django.contrib import admin, messages
from django.db.models import F, Sum
from django.utils.translation import gettext_lazy as _

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ("product", "quantity", "unit_price", "line_total")
    readonly_fields = ("line_total",)
    autocomplete_fields = ("product",)

    def line_total(self, obj):  # pragma: no cover
        if not obj or obj.pk is None:
            return "—"
        try:
            return (obj.quantity or 0) * (obj.unit_price or Decimal("0"))
        except Exception:
            return "—"

    line_total.short_description = "Line total"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "buyer",
        "status",
        "subtotal",
        "shipping",
        "total",
        "created_at",
        "item_count",
    )
    list_filter = ("status", "created_at")
    search_fields = ("id", "buyer__username", "buyer__email")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    inlines = [OrderItemInline]

    fieldsets = (
        (_("Customer & Status"), {"fields": ("buyer", "status")}),
        (_("Amounts"), {"fields": ("subtotal", "shipping", "total")}),
        (_("Meta"), {"fields": ("created_at",)}),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("buyer").prefetch_related("items", "items__product")

    def item_count(self, obj):  # pragma: no cover
        return obj.items.count()

    item_count.short_description = "Items"

    # --- Recalculate amounts whenever order/items change in admin ---
    def _recalc_amounts(self, obj):
        agg = obj.items.aggregate(subtotal=Sum(F("quantity") * F("unit_price")))
        subtotal = agg["subtotal"] or Decimal("0")
        obj.subtotal = subtotal
        obj.total = (obj.subtotal or Decimal("0")) + (obj.shipping or Decimal("0"))

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        self._recalc_amounts(obj)
        obj.save(update_fields=["subtotal", "total"])  # persist computed totals

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        obj = form.instance
        self._recalc_amounts(obj)
        obj.save(update_fields=["subtotal", "total"])  # persist after inline edits

    # ----- Admin actions for common status transitions -----
    @admin.action(description=_("Mark selected as Paid"))
    def mark_paid(self, request, queryset):
        updated = queryset.update(status="paid")
        self.message_user(
            request, _(f"{updated} order(s) marked as Paid."), level=messages.SUCCESS
        )

    @admin.action(description=_("Mark selected as Shipped"))
    def mark_shipped(self, request, queryset):
        updated = queryset.update(status="shipped")
        self.message_user(
            request, _(f"{updated} order(s) marked as Shipped."), level=messages.INFO
        )

    @admin.action(description=_("Mark selected as Delivered"))
    def mark_delivered(self, request, queryset):
        updated = queryset.update(status="delivered")
        self.message_user(
            request,
            _(f"{updated} order(s) marked as Delivered."),
            level=messages.SUCCESS,
        )

    @admin.action(description=_("Mark selected as Canceled"))
    def mark_canceled(self, request, queryset):
        updated = queryset.update(status="canceled")
        self.message_user(
            request,
            _(f"{updated} order(s) marked as Canceled."),
            level=messages.WARNING,
        )

    actions = ("mark_paid", "mark_shipped", "mark_delivered", "mark_canceled")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity", "unit_price")
    search_fields = ("order__id", "product__title")
    list_filter = ("order__status",)
    ordering = ("-order__created_at",)
