from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..deps import get_db
from ..models.product import Product
from ..schemas.product import ProductOut

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    db: Session = Depends(get_db),
    q: str | None = Query(None, description="Text search in title"),
    category_id: int | None = Query(None),
    price_min: float | None = Query(None, ge=0),
    price_max: float | None = Query(None, ge=0),
    limit: int = Query(24, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    query = db.query(Product).filter(Product.status == "active")

    if q:
        ilike = f"%{q}%"
        query = query.filter(Product.title.ilike(ilike))

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if price_min is not None:
        query = query.filter(Product.price >= price_min)

    if price_max is not None:
        query = query.filter(Product.price <= price_max)

    rows = query.order_by(Product.id.desc()).offset(offset).limit(limit).all()

    return rows


@router.get("/{slug}", response_model=ProductOut)
def product_detail(slug: str, db: Session = Depends(get_db)):
    row = (
        db.query(Product)
        .filter(Product.slug == slug, Product.status == "active")
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return row
