# api/routers/orders.py
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_db
from ..auth import get_current_user_id
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
    """
    Quick order endpoint: create a single-product order.
    """
    # Ürün var mı ve aktif mi?
    product = (
        db.query(Product)
        .filter(Product.id == payload.product_id, Product.status == "active")
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or inactive")

    # Miktar kontrolü
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be >= 1")

    unit_price = Decimal(product.price)
    subtotal = unit_price * payload.quantity
    shipping = Decimal(payload.shipping or 0)
    total = subtotal + shipping

    # Sipariş oluştur
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
    db.flush()  # order.id elde etmek için

    # Sipariş kalemi oluştur
    item = OrderItem(
        order_id=order.id,
        product_id=product.id,
        quantity=payload.quantity,
        unit_price=unit_price,
    )
    db.add(item)

    db.commit()
    db.refresh(order)
    order.items  # ilişkiyi yükle
    return order


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """
    Return details of one order belonging to the current user.
    """
    order = (
        db.query(Order).filter(Order.id == order_id, Order.buyer_id == user_id).first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.items  # ilişkili ürünleri getir
    return order
