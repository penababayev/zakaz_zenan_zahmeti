# api/models/catalog.py
from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()


class Product(Base):
    __tablename__ = "catalog_product"
    id = Column(Integer, primary_key=True)
    seller_id = Column(Integer, ForeignKey("users_user.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("catalog_category.id"))
    title = Column(String(180), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    description = Column(String)
    price = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), default="EUR", nullable=False)
    status = Column(String(10), default="draft", nullable=False)
    is_handmade = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
