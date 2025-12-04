# api/schemas/user.py
from pydantic import BaseModel


class SellerShortOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True
