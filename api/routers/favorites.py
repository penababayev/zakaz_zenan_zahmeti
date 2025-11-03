# api/routers/favorites.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_db
from ..security import get_current_user_id
from ..models.favorite import Favorite
from ..models.product import Product
from ..schemas.favorite import FavoriteOut, FavoriteCreate

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=List[FavoriteOut])
def list_favorites(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Return the current user's favorites (most recent first)."""
    rows = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.id.desc())
        .limit(200)
        .all()
    )
    return rows


@router.post("", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
def add_favorite(
    payload: FavoriteCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Idempotent create: if already favorited, return the same row."""
    # ensure product exists and is active
    prod = (
        db.query(Product)
        .filter(Product.id == payload.product_id, Product.status == "active")
        .first()
    )
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found or inactive")

    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id, Favorite.product_id == payload.product_id)
        .first()
    )
    if existing:
        return existing

    fav = Favorite(user_id=user_id, product_id=payload.product_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    product_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    """Remove a product from the current user's favorites. Always returns 204."""
    (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id, Favorite.product_id == product_id)
        .delete()
    )
    db.commit()
    return None
