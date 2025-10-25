from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Address


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "label",
        "full_name",
        "country",
        "city",
        "postal_code",
        "is_default",
        "created_at",
    )
    list_filter = ("country", "is_default", "created_at")
    search_fields = (
        "user__username",
        "user__email",
        "full_name",
        "city",
        "postal_code",
        "line1",
        "line2",
    )
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-is_default", "-created_at")

    fieldsets = (
        (_("Owner"), {"fields": ("user", "is_default", "label")}),
        (_("Recipient"), {"fields": ("full_name", "phone")}),
        (
            _("Address"),
            {"fields": ("line1", "line2", "city", "state", "postal_code", "country")},
        ),
        (_("Meta"), {"fields": ("created_at", "updated_at")}),
    )
