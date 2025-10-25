from django.contrib import admin, messages
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt", "position", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):  # pragma: no cover
        if obj and getattr(obj, "image", None):
            try:
                return format_html(
                    '<img src="{}" style="height:60px;" />', obj.image.url
                )
            except Exception:
                return "—"
        return "—"

    preview.short_description = "Preview"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "slug")
    list_filter = ("parent",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "seller",
        "category",
        "price",
        "currency",
        "status",
        "created_at",
    )
    list_filter = ("status", "category", "currency")
    search_fields = (
        "title",
        "slug",
        "description",
        "seller__username",
        "seller__email",
    )
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at",)
    inlines = [ProductImageInline]
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    fieldsets = (
        (
            _("Basic"),
            {"fields": ("seller", "category", "title", "slug", "description")},
        ),
        (_("Commerce"), {"fields": ("price", "currency", "status", "is_handmade")}),
        (_("Meta"), {"fields": ("created_at",)}),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("seller", "category").prefetch_related("images")

    # ----- Admin actions for quick status changes -----
    @admin.action(description=_("Mark selected as Active"))
    def make_active(self, request, queryset):
        updated = queryset.update(status="active")
        self.message_user(
            request, _(f"{updated} product(s) set to Active."), level=messages.SUCCESS
        )

    @admin.action(description=_("Mark selected as Paused"))
    def make_paused(self, request, queryset):
        updated = queryset.update(status="paused")
        self.message_user(
            request, _(f"{updated} product(s) set to Paused."), level=messages.WARNING
        )

    @admin.action(description=_("Mark selected as Draft"))
    def make_draft(self, request, queryset):
        updated = queryset.update(status="draft")
        self.message_user(
            request, _(f"{updated} product(s) set to Draft."), level=messages.INFO
        )

    actions = ("make_active", "make_paused", "make_draft")


# Optional: direct management of images (rarely needed because of inline)
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "position", "alt")
    list_filter = ("product",)
    search_fields = ("product__title", "alt")
    ordering = ("product", "position")
