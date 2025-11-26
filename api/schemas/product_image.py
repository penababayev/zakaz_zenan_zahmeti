# api/schemas/product_image.py
from pydantic import BaseModel
from typing import Optional


class ProductImageOut(BaseModel):
    id: int
    product_id: int
    image: str
    alt: Optional[str] = None
    position: int

    class Config:
        from_attributes = True
