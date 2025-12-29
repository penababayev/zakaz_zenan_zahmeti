# api/routers/addresses.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..deps import get_db
from ..security import get_current_user_id
from ..models.address import Address
from ..schemas.address import AddressOut, AddressCreate, AddressUpdate

router = APIRouter(prefix="/addresses", tags=["addresses"])


@router.get("", response_model=list[AddressOut])
def list_addresses(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return (
        db.query(Address)
        .filter(Address.user_id == user_id)
        .order_by(Address.is_default.desc(), Address.created_at.desc())
        .all()
    )


@router.post("", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def create_address(
    payload: AddressCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    # default seçildiyse diğerlerini kapat
    if payload.is_default:
        db.query(Address).filter(Address.user_id == user_id, Address.is_default == True).update(  # noqa
            {"is_default": False}
        )

    addr = Address(user_id=user_id, **payload.model_dump())
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.put("/{address_id}", response_model=AddressOut)
def update_address(
    address_id: int,
    payload: AddressUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == user_id)
        .first()
    )
    if not addr:
        raise HTTPException(404, detail="Address not found")

    if payload.is_default:
        db.query(Address).filter(Address.user_id == user_id, Address.is_default == True).update(  # noqa
            {"is_default": False}
        )

    for k, v in payload.model_dump().items():
        setattr(addr, k, v)

    db.commit()
    db.refresh(addr)
    return addr


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == user_id)
        .first()
    )
    if not addr:
        return None

    db.delete(addr)
    db.commit()
    return None
