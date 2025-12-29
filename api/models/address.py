# api/models/address.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from api.db.base import Base


class Address(Base):
    __tablename__ = "shipping_address"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("auth_user.id"), nullable=False)

    label = Column(String(60), nullable=True)
    full_name = Column(String(120), nullable=False)

    phone = Column(String(24), nullable=True)

    line1 = Column(String(180), nullable=False)
    line2 = Column(String(180), nullable=True)
    city = Column(String(120), nullable=False)
    state = Column(String(120), nullable=True)
    postal_code = Column(String(20), nullable=False)

    country = Column(String(2), nullable=False)  # ISO alpha-2 (TR, DE, US...)

    is_default = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


# Django’daki indexleri benzer şekilde koyalım (opsiyonel ama iyi)
Index("idx_addr_user_default", Address.user_id, Address.is_default)
Index("idx_addr_country_postal", Address.country, Address.postal_code)
