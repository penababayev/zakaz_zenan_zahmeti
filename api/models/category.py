from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from api.db.base import Base


class Category(Base):
    __tablename__ = "catalog_category"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    parent_id = Column(Integer, ForeignKey("catalog_category.id"), nullable=True)
    slug = Column(String(140), unique=True, nullable=False)
    products = relationship("Product", back_populates="category")
