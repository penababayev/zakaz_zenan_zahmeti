from django.conf import settings
from django.db import models

from apps.catalog.models import Product


class Favorite(models.Model):
    """Buyer favorites a product. One row per (user, product)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="favorited_by",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "favorites_favorite"
        verbose_name = "Favorite"
        verbose_name_plural = "Favorites"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"], name="uniq_favorite_user_product"
            )
        ]
        indexes = [
            models.Index(fields=["user", "created_at"], name="idx_fav_user_created"),
            models.Index(fields=["product"], name="idx_fav_product"),
        ]
        ordering = ("-created_at",)

    def __str__(self):  # pragma: no cover
        return f"{self.user} → {self.product}"
