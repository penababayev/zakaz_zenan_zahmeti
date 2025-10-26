from pydantic import BaseModel
from typing import List, Optional


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True


class CategoryNode(BaseModel):
    id: int
    name: str
    slug: str
    parent_id: Optional[int] = None
    children: List["CategoryNode"] = []  # type: ignore

    class Config:
        from_attributes = True


CategoryNode.model_rebuild()  # Pydantic v2 recursive model fix
