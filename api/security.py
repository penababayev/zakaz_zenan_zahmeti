# api/security.py
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt  # PyJWT
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from . import django_compat  # noqa: F401  # ensure Django is initialized
from django.contrib.auth.hashers import check_password

from .deps import get_db
from .models.user import User

JWT_SECRET = os.getenv("JWT_SECRET", os.getenv("DJANGO_SECRET_KEY", "dev-secret"))
JWT_ALG = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MIN", "120"))  # 2 hours default


def create_access_token(
    *, user_id: int, username: str, expires_minutes: int = JWT_EXPIRE_MIN
) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=expires_minutes)).timestamp()),
        "type": "access",
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)
    return token


def verify_password(plain: str, hashed: str) -> bool:
    # Use Django's password hasher to verify against auth_user.password
    return check_password(plain, hashed)


def authenticate_user(
    db: Session, username_or_email: str, password: str
) -> Optional[User]:
    q = db.query(User)
    user = (
        q.filter(User.username == username_or_email).first()
        or q.filter(User.email == username_or_email).first()
    )
    if not user:
        return None
    if not user.is_active:
        return None
    if not verify_password(password, user.password):
        return None
    return user


# ----- FastAPI dependency to read Bearer token -----
_bearer = HTTPBearer(auto_error=False)


def get_current_user_id(creds: HTTPAuthorizationCredentials = Depends(_bearer)) -> int:
    if creds is None or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Bearer token"
        )
    token = creds.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    try:
        return int(sub)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid subject in token")


_optional_bearer = HTTPBearer(auto_error=False)


def get_optional_user_id(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(_optional_bearer),
) -> Optional[int]:
    """
    Token varsa decode et, yoksa None döndür.
    Product detail gibi public endpoint'lerde kullanacağız.
    """
    if creds is None or not creds.credentials:
        return None

    token = creds.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        # Burada istersen 401 da atabilirsin; ben şimdilik 'token varsa ama bozuksa' 401 diyorum:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    try:
        return int(sub)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid subject in token")
