# api/routers/orders.py (JWT version with list + cancel)
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_db
from ..security import get_current_user_id  # JWT Bearer dependency
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..schemas.order import OrderOut, OrderCreateQuick

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order_quick(
    payload: OrderCreateQuick,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Create a basic single-product order using JWT user context."""
    product = (
        db.query(Product)
        .filter(Product.id == payload.product_id, Product.status == "active")
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or inactive")

    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be >= 1")

    unit_price = Decimal(product.price)
    subtotal = unit_price * payload.quantity
    shipping = Decimal(payload.shipping or 0)
    total = subtotal + shipping

    order = Order(
        buyer_id=user_id,
        status="pending",
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        shipping_address_id=payload.address_id,
        shipping_snapshot={},
    )
    db.add(order)
    db.flush()

    item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        quantity=payload.quantity,
        unit_price=unit_price,
    )
    db.add(item)

    db.commit()
    db.refresh(order)
    order.items
    return order


@router.get("", response_model=list[OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Return all orders of the current user, newest first."""
    orders = (
        db.query(Order)
        .filter(Order.buyer_id == user_id)
        .order_by(Order.id.desc())
        .all()
    )
    for o in orders:
        o.items
    return orders


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    order = (
        db.query(Order).filter(Order.id == order_id, Order.buyer_id == user_id).first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.items
    return order


@router.post("/{order_id}/cancel", status_code=status.HTTP_200_OK)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Cancel an order if it is still pending."""
    order = (
        db.query(Order).filter(Order.id == order_id, Order.buyer_id == user_id).first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status not in ("pending", "paid"):
        raise HTTPException(status_code=400, detail="Cannot cancel this order")

    order.status = "canceled"
    db.commit()
    db.refresh(order)
    return {"status": "canceled", "order_id": order.id}
