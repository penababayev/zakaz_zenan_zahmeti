# api/schemas/address.py
from pydantic import BaseModel, Field
from typing import Optional


class AddressOut(BaseModel):
    id: int
    label: Optional[str] = None
    full_name: str
    phone: Optional[str] = None

    line1: str
    line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str

    is_default: bool

    class Config:
        from_attributes = True


class AddressCreate(BaseModel):
    label: Optional[str] = Field(None, max_length=60)
    full_name: str = Field(..., min_length=1, max_length=120)
    phone: Optional[str] = Field(None, max_length=24)

    line1: str = Field(..., min_length=1, max_length=180)
    line2: Optional[str] = Field(None, max_length=180)
    city: str = Field(..., min_length=1, max_length=120)
    state: Optional[str] = Field(None, max_length=120)
    postal_code: str = Field(..., min_length=1, max_length=20)

    country: str = Field(..., min_length=2, max_length=2)  # "TR", "DE" vb.

    is_default: bool = False


class AddressUpdate(AddressCreate):
    pass
