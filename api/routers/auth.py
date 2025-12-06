# api/routers/auth.py — login with Django users → JWT
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..deps import get_db
from ..security import authenticate_user, create_access_token, hash_password
from ..models.user import User, SellerProfile

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginInput(BaseModel):
    username_or_email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


# 🆕 Signup input
class SignupInput(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirm_password: str
    shop_name: str
    location: str
    phone_number: str
    bio: str | None = None

    @field_validator("confirm_password")
    def passwords_match(cls, v, values):
        pwd = values.get("password")
        if pwd is not None and v != pwd:
            raise ValueError("Passwords do not match")
        return v


@router.post("/login", response_model=TokenOut)
def login(payload: LoginInput, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.username_or_email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    token = create_access_token(user_id=user.id, username=user.username)
    return TokenOut(access_token=token)


# 🆕 /auth/signup — seller olarak kayıt
@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupInput, db: Session = Depends(get_db)):
    # 1) username / email var mı?
    existing_user = (
        db.query(User)
        .filter(
            or_(
                User.username == payload.username,
                User.email == payload.email,
            )
        )
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists",
        )

    # 2) shop_name var mı?
    existing_shop = (
        db.query(SellerProfile)
        .filter(SellerProfile.shop_name == payload.shop_name)
        .first()
    )
    if existing_shop:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Shop name already exists",
        )

    now = datetime.now(timezone.utc)

    # 3) Django ile uyumlu user oluştur
    user = User(
        username=payload.username,
        email=payload.email,
        password=hash_password(payload.password),  # ⬅️ Django hash
        is_active=True,
        is_staff=False,
        is_superuser=False,
        date_joined=now,
    )
    db.add(user)
    db.flush()  # user.id almak için

    # 4) SellerProfile kaydı oluştur
    seller_profile = SellerProfile(
        user_id=user.id,
        shop_name=payload.shop_name,
        bio=payload.bio or "",
        location=payload.location,
        phone_number=payload.phone_number,
        commission_rate="10.00",  # default
        is_verified=False,
        created_at=now,
        updated_at=now,
    )
    db.add(seller_profile)

    # 5) commit + token döndür
    db.commit()
    db.refresh(user)

    token = create_access_token(user_id=user.id, username=user.username)
    return TokenOut(access_token=token)
