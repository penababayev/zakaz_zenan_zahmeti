# api/routers/seller.py — Seller panel endpoints
from typing import List, Dict, Any, Optional
import re, os, uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..models.product import SellerProductUpdate
from ..deps import get_db
from ..security import get_current_user_id
from ..models.product import Product
from ..models.order import Order, OrderItem
from ..schemas.product import ProductOut, SellerProductCreate
from ..schemas.order import OrderOut, OrderItemOut
from ..models.product_image import ProductImage
from ..schemas.product_image import ProductImageOut
from fastapi import UploadFile, File, Form

router = APIRouter(prefix="/seller", tags=["seller"])





def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return slug or "product"

def _unique_slug(db: Session, base: str) -> str:
    slug = base
    i = 1
    while db.query(Product).filter(Product.slug == slug).first() is not None:
        i += 1
        slug = f"{base}-{i}"
    return slug

def _media_root() -> Path:
    # docker compose kullanıyorsan bunu volume ile eşleştirmen iyi olur (./backend/media gibi)
    root = os.getenv("MEDIA_ROOT", "media")
    p = Path(root).resolve()
    (p / "products").mkdir(parents=True, exist_ok=True)
    return p





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



@router.post("/products", response_model=ProductOut, status_code=201)
def create_product(
    payload: SellerProductCreate,
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    allowed = {"draft", "active", "paused"}
    if payload.status not in allowed:
        raise HTTPException(400, detail=f"status must be one of {allowed}")

    slug_base = _slugify(payload.title)
    slug = _unique_slug(db, slug_base)

    prod = Product(
        seller_id=seller_id,
        category_id=payload.category_id,
        title=payload.title,
        slug=slug,
        description=payload.description or "",
        price=payload.price,
        currency=(payload.currency or "EUR").upper(),
        status=payload.status,
        is_handmade=payload.is_handmade,
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


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


@router.put("/products/{product_id}", response_model=ProductOut)
def replace_product(
    product_id: int,
    payload: SellerProductUpdate,
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    """
    Full update (PUT) for a product owned by the seller.

    Tüm önemli alanlar zorunlu:
    - title, price, currency, status, is_handmade
    - description, category_id opsiyonel
    """
    prod = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == seller_id)
        .first()
    )
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    # İş kuralları doğrulaması
    try:
        payload.validate_status()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    prod.title = payload.title
    prod.price = payload.price
    prod.description = payload.description or ""
    prod.currency = payload.normalized_currency()
    prod.category_id = payload.category_id
    prod.status = payload.status
    prod.is_handmade = payload.is_handmade

    db.commit()
    db.refresh(prod)
    return prod




@router.post(
    "/products/{product_id}/images",
    response_model=ProductImageOut,
    status_code=201
)
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    alt: Optional[str] = Form(None),
    position: int = Form(0),
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    # ürün satıcıya ait mi?
    prod = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == seller_id)
        .first()
    )
    if not prod:
        raise HTTPException(404, detail="Product not found or not yours")

    # uzantı güvenli mi?
    ext = (Path(file.filename or "").suffix or "").lower()
    allowed_ext = {".jpg", ".jpeg", ".png", ".webp"}
    if ext not in allowed_ext:
        raise HTTPException(400, detail="Only .jpg, .jpeg, .png, .webp allowed")

    media_root = _media_root()
    filename = f"{uuid.uuid4().hex}{ext}"
    rel_path = Path("products") / filename
    abs_path = media_root / rel_path

    # kaydet
    content = file.file.read()
    with abs_path.open("wb") as f:
        f.write(content)

    # DB kaydı (Django ImageField gibi relative path saklıyoruz)
    img = ProductImage(
        product_id=product_id,
        image=str(rel_path).replace("\\", "/"),
        alt=alt or "",
        position=int(position or 0),
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img












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


@router.get("/products/{product_id}/images", response_model=List[ProductImageOut])
def product_images(
    product_id: int,
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    """List images for a product owned by the current seller."""
    prod = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == seller_id)
        .first()
    )
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found or not yours")

    images = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product_id)
        .order_by(ProductImage.position.asc(), ProductImage.id.asc())
        .all()
    )
    return images


@router.delete(
    "/products/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    seller_id: int = Depends(get_current_user_id),
):
    """Delete one image belonging to a product owned by current seller."""
    prod = (
        db.query(Product)
        .filter(Product.id == product_id, Product.seller_id == seller_id)
        .first()
    )
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found or not yours")

    img = (
        db.query(ProductImage)
        .filter(ProductImage.id == image_id, ProductImage.product_id == product_id)
        .first()
    )
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # 1) Dosyayı diskten sil (güvenli path kontrolüyle)
    media_root = _media_root()
    rel = Path(img.image)  # örn: products/abc.jpg

    # path traversal engeli: resolve edilen yol media_root içinde olmalı
    abs_path = (media_root / rel).resolve()
    if str(abs_path).startswith(str(media_root.resolve())):
        try:
            if abs_path.exists() and abs_path.is_file():
                abs_path.unlink()
        except Exception:
            # Dosya silinemezse DB silmeyi engellemiyoruz (istersen burada 500 de atabiliriz)
            pass

    db.delete(img)
    db.commit()
    return None
