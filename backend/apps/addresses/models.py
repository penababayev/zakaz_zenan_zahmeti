from django.conf import settings
from django.db import models
from django.core.validators import RegexValidator


class Address(models.Model):
    """User address book entry (shipping/billing).
    You usually snapshot these fields onto an Order at purchase time.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="addresses",
    )

    label = models.CharField(
        max_length=60,
        blank=True,
        help_text="Optional label like 'Home', 'Office'",
    )
    full_name = models.CharField(max_length=120)

    phone = models.CharField(
        max_length=24,
        blank=True,
        validators=[RegexValidator(r"^[0-9+()\-\s]{6,24}$", "Invalid phone format")],
    )

    line1 = models.CharField("Address line 1", max_length=180)
    line2 = models.CharField("Address line 2", max_length=180, blank=True)
    city = models.CharField(max_length=120)
    state = models.CharField("State/Region", max_length=120, blank=True)
    postal_code = models.CharField(max_length=20)

    country = models.CharField(
        max_length=2,
        help_text="ISO 3166-1 alpha-2 country code (e.g., 'DE', 'TR', 'HU', 'US')",
    )

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "shipping_address"
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        ordering = ("-is_default", "-created_at")
        indexes = [
            models.Index(fields=["user", "is_default"], name="idx_addr_user_default"),
            models.Index(
                fields=["country", "postal_code"], name="idx_addr_country_postal"
            ),
        ]

    def __str__(self):  # pragma: no cover
        base = f"{self.full_name} — {self.line1}, {self.city} {self.postal_code}, {self.country}"
        if self.label:
            return f"[{self.label}] " + base
        return base
