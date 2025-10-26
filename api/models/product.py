from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Product(Base):
    __tablename__ = "catalog_product"

    id = Column(Integer, primary_key=True)
    seller_id = Column(
        Integer, ForeignKey("auth_user.id"), nullable=False
    )  # default User table
    category_id = Column(Integer, ForeignKey("catalog_category.id"))

    title = Column(String(180), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    description = Column(String)

    price = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="EUR")
    status = Column(String(10), nullable=False, default="draft")
    is_handmade = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, server_default=func.now())
