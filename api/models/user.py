# api/models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from api.db.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "auth_user"

    id = Column(Integer, primary_key=True)
    username = Column(String(150), nullable=False, unique=True)
    email = Column(String(254), nullable=False, default="")
    password = Column(String(128), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    is_staff = Column(Boolean, nullable=False, default=False)
    is_superuser = Column(Boolean, nullable=False, default=False)
    last_login = Column(DateTime)
    date_joined = Column(DateTime)


class SellerProfile(Base):
    __tablename__ = "profiles_seller"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, unique=True)  # One-to-one with User
    shop_name = Column(String(120), nullable=False, unique=True)
    products = relationship("Product", back_populates="shop")
    bio = Column(String)
    location = Column(String(255), nullable=False)

    commission_rate = Column(
        String(5), nullable=False, default="10.00"
    )  # Commission percentage
    is_verified = Column(
        Boolean, nullable=False, default=False
    )  # Seller verification status

    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
