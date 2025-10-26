from pydantic import BaseModel
from datetime import datetime


class FavoriteOut(BaseModel):
    id: int
    product_id: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class FavoriteCreate(BaseModel):
    product_id: int
