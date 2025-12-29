# api/routers/orders.py
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_db
from ..security import get_current_user_id
from ..models.order import Order, OrderItem
from ..models.product import Product
from ..models.address import Address
from ..schemas.order import OrderOut, OrderCreateQuick, OrderCreateCart

router = APIRouter(prefix="/orders", tags=["orders"])


def _build_shipping_snapshot(addr: Address) -> dict:
    return {
        "id": addr.id,
        "label": addr.label,
        "full_name": addr.full_name,
        "phone": addr.phone,
        "line1": addr.line1,
        "line2": addr.line2,
        "city": addr.city,
        "state": addr.state,
        "postal_code": addr.postal_code,
        "country": addr.country,
    }


def _validate_address(db: Session, user_id: int, address_id: int | None) -> tuple[int | None, dict]:
    """
    address_id varsa:
      - bu user'a ait mi kontrol et
      - snapshot üret
    """
    if not address_id:
        return None, {}

    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == user_id)
        .first()
    )
    if not addr:
        raise HTTPException(status_code=400, detail="Invalid address_id")

    return addr.id, _build_shipping_snapshot(addr)


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order_quick(
    payload: OrderCreateQuick,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be >= 1")

    try:
        with db.begin():
            # Address doğrula + snapshot
            addr_id, ship_snap = _validate_address(
                db, user_id, getattr(payload, "address_id", None)
            )

            # Ürünü kilitle
            product = (
                db.query(Product)
                .filter(Product.id == payload.product_id, Product.status == "active")
                .with_for_update()
                .first()
            )
            if not product:
                raise HTTPException(status_code=404, detail="Product not found or inactive")

            # stok kontrol
            current_stock = int(getattr(product, "stock_quantity", 0) or 0)
            if current_stock < payload.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock (available: {current_stock})",
                )

            # stok düş
            product.stock_quantity = current_stock - payload.quantity
            if product.stock_quantity == 0:
                product.status = "paused"

            unit_price = Decimal(product.price)
            subtotal = unit_price * payload.quantity
            shipping = Decimal(str(payload.shipping or 0))
            total = subtotal + shipping

            order = Order(
                buyer_id=user_id,
                status="pending",
                subtotal=subtotal,
                shipping=shipping,
                total=total,
                shipping_address_id=addr_id,
                shipping_snapshot=ship_snap,
            )
            db.add(order)
            db.flush()  # order.id al

            item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=payload.quantity,
                unit_price=unit_price,
            )
            db.add(item)

        db.refresh(order)
        order.items
        return order

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Order creation failed")


@router.post("/cart", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order_cart(
    payload: OrderCreateCart,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    # aynı product tekrar gelirse birleştir
    merged: dict[int, int] = {}
    for it in payload.items:
        merged[it.product_id] = merged.get(it.product_id, 0) + it.quantity

    product_ids = sorted(merged.keys())
    if not product_ids:
        raise HTTPException(status_code=400, detail="Cart is empty")

    try:
        with db.begin():
            # Address doğrula + snapshot
            addr_id, ship_snap = _validate_address(
                db, user_id, getattr(payload, "address_id", None)
            )

            # ürünleri kilitle
            products = (
                db.query(Product)
                .filter(Product.id.in_(product_ids), Product.status == "active")
                .with_for_update()
                .all()
            )

            found_ids = {p.id for p in products}
            missing = [pid for pid in product_ids if pid not in found_ids]
            if missing:
                raise HTTPException(
                    status_code=404,
                    detail=f"Some products not found or inactive: {missing}",
                )

            prod_map = {p.id: p for p in products}

            subtotal = Decimal("0")
            order_items: list[OrderItem] = []

            for pid in product_ids:
                p = prod_map[pid]
                qty = merged[pid]
                if qty < 1:
                    raise HTTPException(status_code=400, detail="Quantity must be >= 1")

                current_stock = int(getattr(p, "stock_quantity", 0) or 0)
                if current_stock < qty:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Insufficient stock for product {pid} (available: {current_stock})",
                    )

                # stok düş
                p.stock_quantity = current_stock - qty
                if p.stock_quantity == 0:
                    p.status = "paused"

                unit_price = Decimal(p.price)
                subtotal += unit_price * qty

                order_items.append(
                    OrderItem(
                        product_id=p.id,
                        quantity=qty,
                        unit_price=unit_price,
                    )
                )

            shipping = Decimal(str(payload.shipping or 0))
            total = subtotal + shipping

            order = Order(
                buyer_id=user_id,
                status="pending",
                subtotal=subtotal,
                shipping=shipping,
                total=total,
                shipping_address_id=addr_id,
                shipping_snapshot=ship_snap,
            )
            db.add(order)
            db.flush()

            for oi in order_items:
                oi.order_id = order.id
                db.add(oi)

        db.refresh(order)
        order.items
        return order

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Order creation failed")


@router.get("", response_model=list[OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
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
        db.query(Order)
        .filter(Order.id == order_id, Order.buyer_id == user_id)
        .first()
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
    """
    Cancel an order if it is still pending/paid.
    Restores stock for each item and re-activates paused products if stock > 0.
    """
    try:
        with db.begin():
            order = (
                db.query(Order)
                .filter(Order.id == order_id, Order.buyer_id == user_id)
                .with_for_update()
                .first()
            )
            if not order:
                raise HTTPException(status_code=404, detail="Order not found")

            if order.status not in ("pending", "paid"):
                raise HTTPException(status_code=400, detail="Cannot cancel this order")

            items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

            product_ids = sorted({it.product_id for it in items})
            if product_ids:
                products = (
                    db.query(Product)
                    .filter(Product.id.in_(product_ids))
                    .with_for_update()
                    .all()
                )
                prod_map = {p.id: p for p in products}

                for it in items:
                    p = prod_map.get(it.product_id)
                    if not p:
                        continue

                    current_stock = int(getattr(p, "stock_quantity", 0) or 0)
                    p.stock_quantity = current_stock + int(it.quantity)

                    # stok geri geldiyse ve paused ise active yap
                    if p.stock_quantity > 0 and p.status == "paused":
                        p.status = "active"

            order.status = "canceled"

        return {"status": "canceled", "order_id": order_id}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Cancel failed")
