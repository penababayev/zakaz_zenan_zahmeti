# api/routers/products.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db
from ..models.catalog import Product
from ..schemas.catalog import ProductOut

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(q: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.status == "active")
    if q:
        ilike = f"%{q}%"
        query = query.filter(Product.title.ilike(ilike))
    return query.order_by(Product.id.desc()).limit(50).all()
