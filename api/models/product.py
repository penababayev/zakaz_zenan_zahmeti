from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from typing import Optional
from pydantic import BaseModel, Field
from sqlalchemy.sql import func
from api.db.base import Base


class Product(Base):
    __tablename__ = "catalog_product"

    id = Column(Integer, primary_key=True)
    seller_id = Column(
        Integer, ForeignKey("auth_user.id"), nullable=False
    )  # default User table
    category_id = Column(Integer, ForeignKey("catalog_category.id"))
    category = relationship("Category", back_populates="products")
    seller = relationship("User", back_populates="products")
    title = Column(String(180), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    description = Column(String)

    price = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="EUR")
    stock_quantity = Column(Integer, nullable=False, default=0)
    status = Column(String(10), nullable=False, default="draft")
    is_handmade = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, server_default=func.now())

    images = relationship("ProductImage", back_populates="product", lazy="selectin")

    @property
    def category_name(self):
        return self.category.name if self.category else None

    @property
    def shop_name(self) -> str:
        if (
            self.seller
            and self.seller.seller_profile
            and self.seller.seller_profile.shop_name
        ):
            return self.seller.seller_profile.shop_name
        # yedek olarak username dön
        return self.seller.username if self.seller else ""

    @property
    def location(self):
        sp = getattr(self.seller, "seller_profile", None)
        if sp and sp.location:
            return sp.location
        return None

    @property
    def phone_number(self):
        sp = getattr(self.seller, "seller_profile", None)
        if sp and sp.phone_number:
            return sp.phone_number
        return None


# class ProductImage(Base):
#     __tablename__ = "catalog_productimage"

#     id = Column(Integer, primary_key=True)
#     product_id = Column(Integer, ForeignKey("catalog_product.id"), nullable=False)
#     image = Column(String, nullable=False)
#     alt = Column(String(120), nullable=True)
#     position = Column(Integer, nullable=False, default=0)

#     product = relationship("Product", back_populates="images")


class SellerProductUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=180)
    price: float = Field(..., ge=0)
    description: Optional[str] = Field(None, max_length=10_000)
    currency: str = Field("EUR", min_length=3, max_length=3)
    category_id: Optional[int] = None
    status: str = Field("draft")  # draft / active / paused
    is_handmade: bool = True

    def validate_status(self):
        allowed = {"draft", "active", "paused"}
        if self.status not in allowed:
            raise ValueError(f"status must be one of {allowed}")

    def normalized_currency(self) -> str:
        # 3 harfli para birimini hep büyük harfe çevir
        return self.currency.upper()
