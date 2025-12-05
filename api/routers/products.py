from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from ..schemas.product import ProductDetailOut
from ..deps import get_db
from ..security import get_optional_user_id
from ..models.user import User
from ..schemas.user import SellerShortOut
from ..models.product_image import ProductImage
from ..schemas.product_image import ProductImageOut
from ..models.favorite import Favorite
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
    query = (
        db.query(Product)
        .options(
            selectinload(Product.images),  # Product.images ilişkisinin dolması için
            selectinload(Product.category),  # category_name property’si için
        )
        .filter(Product.status == "active")
    )

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


@router.get("/{product_id}", response_model=ProductDetailOut)
def product_detail_2(
    product_id: int,
    db: Session = Depends(get_db),
    user_id: int | None = Depends(get_optional_user_id),
):
    """
    Buyer tarafı için product detay:
    - seller bilgisi
    - resimler
    - is_favorited (login olduysa)
    """
    # Sadece aktif ürünleri göster
    prod = (
        db.query(Product)
        .filter(Product.id == product_id, Product.status == "active")
        .first()
    )
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    # Seller bilgisi
    seller = db.query(User).filter(User.id == prod.seller_id).first()
    if not seller:
        raise HTTPException(status_code=500, detail="Seller not found")

    seller_out = SellerShortOut.from_orm(seller)

    # Görseller
    images = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == prod.id)
        .order_by(ProductImage.position.asc(), ProductImage.id.asc())
        .all()
    )
    images_out = [ProductImageOut.from_orm(img) for img in images]

    # Favori mi?
    is_fav = False
    if user_id is not None:
        fav = (
            db.query(Favorite)
            .filter(Favorite.user_id == user_id, Favorite.product_id == prod.id)
            .first()
        )
        is_fav = fav is not None

    return ProductDetailOut(
        id=prod.id,
        title=prod.title,
        slug=prod.slug,
        description=prod.description,
        price=prod.price,
        currency=prod.currency,
        status=prod.status,
        is_handmade=prod.is_handmade,
        category_id=prod.category_id,
        created_at=prod.created_at,
        seller=seller_out,
        images=images_out,
        is_favorited=is_fav,
    )
