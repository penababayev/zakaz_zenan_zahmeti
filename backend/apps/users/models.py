from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class SellerProfile(models.Model):
    """
    One-to-one shop profile for marketplace sellers.
    Uses Django's built-in User model as the account.
    Admin can toggle verification and adjust commission per seller.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="seller_profile",
    )
    shop_name = models.CharField(max_length=120, unique=True)
    bio = models.TextField(blank=True)

    # Commission rate as percentage (e.g., 10.0 = 10%) for future paid flow
    commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Commission percentage taken on each successful order.",
    )

    is_verified = models.BooleanField(
        default=False,
        help_text=(
            "If enabled, the seller is approved by admins and can list products publicly."
        ),
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "profiles_seller"
        verbose_name = "Seller Profile"
        verbose_name_plural = "Seller Profiles"
        indexes = [
            models.Index(fields=["shop_name"], name="idx_seller_shop_name"),
            models.Index(fields=["is_verified"], name="idx_seller_verified"),
        ]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.shop_name} ({self.user.username})"
