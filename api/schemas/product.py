from pydantic import BaseModel
from decimal import Decimal


class ProductOut(BaseModel):
    id: int
    title: str
    slug: str
    price: Decimal
    currency: str

    class Config:
        from_attributes = True
