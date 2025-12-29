from pydantic import BaseModel, Field
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
    stock_quantity: int
    description: str
    images: List["ProductImageOut"] = []
    category_id: int | None = None
    category_name: str | None = None
    shop_name: str | None = None
    location: str | None = None
    phone_number: str | None = None

    class Config:
        from_attributes = True


# class SellerProductCreate(BaseModel):
#     title: str = Field(..., min_length=1, max_length=180)
#     price: float = Field(..., ge=0)
#     description: str = ""
#     currency: str = Field("EUR", min_length=3, max_length=3)
#     category_id: Optional[int] = None
#     status: str = Field("draft")   # draft/active/paused
#     is_handmade: bool = True


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
    # images: List[ProductImageOut] = []
    is_favorited: bool = False

    class Config:
        from_attributes = True



class SellerProductCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=180)
    price: float = Field(..., ge=0)
    stock_quantity: int = Field(0, ge=0)
    description: str = ""
    currency: str = Field("EUR", min_length=3, max_length=3)
    category_id: Optional[int] = None
    status: str = Field("draft")   # draft/active/paused
    is_handmade: bool = True





class StockUpdate(BaseModel):
    stock_quantity: int = Field(..., ge=0)