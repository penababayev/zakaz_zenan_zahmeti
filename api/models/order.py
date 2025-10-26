from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()


class Order(Base):
    __tablename__ = "orders_order"

    id = Column(Integer, primary_key=True)
    buyer_id = Column(Integer, ForeignKey("auth_user.id"), nullable=False)
    status = Column(String(12), nullable=False, default="pending")

    subtotal = Column(Numeric(12, 2), nullable=False, default=0)
    shipping = Column(Numeric(12, 2), nullable=False, default=0)
    total = Column(Numeric(12, 2), nullable=False, default=0)

    shipping_address_id = Column(
        Integer, ForeignKey("shipping_address.id"), nullable=True
    )
    shipping_snapshot = Column(JSON, nullable=False, default=dict)

    created_at = Column(DateTime, server_default=func.now())

    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "orders_orderitem"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders_order.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("catalog_product.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)

    order = relationship("Order", back_populates="items")
