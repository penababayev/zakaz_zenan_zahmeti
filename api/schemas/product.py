from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional
from .product_image import ProductImageOut
from .user import SellerShortOut
from datetime import datetime


class ProductOut(BaseModel):
    id: int
    title: str
    slug: str
    price: Decimal
    currency: str
    description: str
    images: List["ProductImageOut"] = []
    category_id: int | None
    category_name: str | None
    shop_name: str | None

    class Config:
        from_attributes = True


class ProductDetailOut(ProductOut):
    # id: int
    # title: str
    # slug: str
    # description: str
    # price: Decimal
    # currency: str
    status: str
    is_handmade: bool
    # category_id: Optional[int] = None
    created_at: Optional[datetime] = None

    seller: SellerShortOut
    images: List[ProductImageOut] = []
    is_favorited: bool = False

    class Config:
        from_attributes = True
