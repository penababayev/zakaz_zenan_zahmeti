from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    status: str
    subtotal: Decimal
    shipping: Decimal
    total: Decimal
    created_at: datetime | None = None
    shipping_snapshot: dict = Field(default_factory=dict)
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True


class OrderCreateQuick(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, default=1)
    address_id: Optional[int] = None
    shipping: Decimal = Field(default=0, ge=0)
