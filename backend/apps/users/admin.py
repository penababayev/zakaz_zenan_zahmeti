from django.contrib import admin, messages
from django.utils.translation import gettext_lazy as _

from .models import SellerProfile


@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "shop_name",
        "user",
        "is_verified",
        "commission_rate",
        "created_at",
    )
    list_filter = ("is_verified",)
    search_fields = (
        "shop_name",
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("is_verified", "commission_rate")
    autocomplete_fields = ("user",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    fieldsets = (
        (_("Account"), {"fields": ("user", "is_verified")}),
        (_("Shop"), {"fields": ("shop_name", "location", "bio")}),
        (_("Commerce"), {"fields": ("commission_rate",)}),
        (_("Timestamps"), {"fields": ("created_at", "updated_at")}),
    )

    def get_queryset(self, request):  # optimize list view
        qs = super().get_queryset(request)
        return qs.select_related("user")

    # ----- Admin actions -----
    @admin.action(description=_("Mark selected sellers as verified"))
    def mark_verified(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(
            request,
            _(f"{updated} seller(s) marked as verified."),
            level=messages.SUCCESS,
        )

    @admin.action(description=_("Mark selected sellers as unverified"))
    def mark_unverified(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(
            request,
            _(f"{updated} seller(s) marked as unverified."),
            level=messages.WARNING,
        )

    actions = (
        "mark_verified",
        "mark_unverified",
    )
