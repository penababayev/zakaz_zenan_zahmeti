# api/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from api.db.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from api.common.enums import LocationEnum


class User(Base):
    __tablename__ = "auth_user"

    id = Column(Integer, primary_key=True)
    first_name = Column(String(150), nullable=False, default="")
    last_name = Column(String(150), nullable=False, default="")
    username = Column(String(150), nullable=False, unique=True)
    email = Column(String(254), nullable=False, default="")
    password = Column(String(128), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    is_staff = Column(Boolean, nullable=False, default=False)
    is_superuser = Column(Boolean, nullable=False, default=False)
    last_login = Column(DateTime)
    date_joined = Column(DateTime)
    products = relationship("Product", back_populates="seller")
    seller_profile = relationship("SellerProfile", back_populates="user", uselist=False)


class SellerProfile(Base):
    __tablename__ = "profiles_seller"

    id = Column(Integer, primary_key=True)
    # user_id = Column(Integer, nullable=False, unique=True)  # One-to-one with User
    user_id = Column(Integer, ForeignKey("auth_user.id"), unique=True)
    shop_name = Column(String(120), nullable=False, unique=True)
    user = relationship("User", back_populates="seller_profile")
    bio = Column(String)
    location = Column(String(255), nullable=False)
    phone_number = Column(String(32), nullable=False)

    commission_rate = Column(
        String(5), nullable=False, default="10.00"
    )  # Commission percentage
    is_verified = Column(
        Boolean, nullable=False, default=False
    )  # Seller verification status

    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
