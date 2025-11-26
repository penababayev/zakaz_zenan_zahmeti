# api/models/product_image.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ProductImage(Base):
    __tablename__ = "catalog_productimage"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("catalog_product.id"), nullable=False)
    image = Column(
        String, nullable=False
    )  # e.g. "products/abc.jpg" (relative to MEDIA_ROOT)
    alt = Column(String(120), nullable=True)
    position = Column(Integer, nullable=False, default=0)
