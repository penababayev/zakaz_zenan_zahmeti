from pydantic import BaseModel
from decimal import Decimal
from typing import List
from .product_image import ProductImageOut


class ProductOut(BaseModel):
    id: int
    title: str
    slug: str
    price: Decimal
    currency: str
    description: str
    images: List["ProductImageOut"] = []
    category_name: str | None

    class Config:
        from_attributes = True
