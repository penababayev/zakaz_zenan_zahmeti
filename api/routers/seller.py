# api/routers/seller.py — Seller panel endpoints
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..deps import get_db
from ..security import get_current_user_id
from ..models.product import Product
from ..models.order import Order, OrderItem
from ..schemas.product import ProductOut
from ..schemas.order import OrderOut, OrderItemOut

router = APIRouter(prefix="/seller", tags=["seller"])


# ---------- PRODUCTS ----------
@router.get("/products", response_model=List[ProductOut])
def my_products(
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
    status_in: List[str] | None = Query(None, description="Filter by status values"),
    q: str | None = Query(None, description="Search in title"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    query = db.query(Product).filter(Product.seller_id == seller_id)
    if status_in:
        query = query.filter(Product.status.in_(status_in))
    if q:
        query = query.filter(Product.title.ilike(f"%{q}%"))
    rows = query.order_by(Product.id.desc()).offset(offset).limit(limit).all()
    return rows


@router.patch("/products/{product_id}", response_model=ProductOut)
def update_product_minimal(
    product_id: int,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    """Minimal patch: allow seller to change own product's title/price/status.
    Body example: {"title":"New","price":12.5,"status":"paused"}
    """
    prod = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == seller_id)
        .first()
    )
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    allowed = {"title", "price", "status"}
    for k, v in payload.items():
        if k in allowed:
            setattr(prod, k, v)
    db.commit()
    db.refresh(prod)
    return prod


# ---------- ORDERS (seller view) ----------
@router.get("/orders", response_model=List[OrderOut])
def seller_orders(
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
    order_status: List[str] | None = Query(None, description="Filter orders by status"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    # Fetch orders that include at least one item from this seller
    q = (
        db.query(Order)
        .join(OrderItem, OrderItem.order_id == Order.id)
        .join(Product, Product.id == OrderItem.product_id)
        .filter(Product.seller_id == seller_id)
    )
    if order_status:
        q = q.filter(Order.status.in_(order_status))

    orders = q.distinct().order_by(Order.id.desc()).offset(offset).limit(limit).all()

    # For each order, keep only items belonging to this seller in response
    for o in orders:
        seller_items = (
            db.query(OrderItem)
            .join(Product, Product.id == OrderItem.product_id)
            .filter(OrderItem.order_id == o.id, Product.seller_id == seller_id)
            .all()
        )
        # attach filtered items for Pydantic serialization
        o.items = seller_items  # type: ignore[attr-defined]
    return orders


@router.get("/orders/{order_id}", response_model=OrderOut)
def seller_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    # Ensure order contains this seller's items
    o = (
        db.query(Order)
        .join(OrderItem, OrderItem.order_id == Order.id)
        .join(Product, Product.id == OrderItem.product_id)
        .filter(Order.id == order_id, Product.seller_id == seller_id)
        .first()
    )
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")

    seller_items = (
        db.query(OrderItem)
        .join(Product, Product.id == OrderItem.product_id)
        .filter(OrderItem.order_id == o.id, Product.seller_id == seller_id)
        .all()
    )
    o.items = seller_items  # type: ignore[attr-defined]
    return o
