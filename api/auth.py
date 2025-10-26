from fastapi import Header, HTTPException, status


def get_current_user_id(
    x_user_id: int | None = Header(default=None, alias="X-User-Id"),
) -> int:
    """
    DEV-ONLY auth dependency.
    Reads numeric user id from X-User-Id header.
    Replace with JWT verification in production.
    """
    if x_user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-User-Id header (dev auth)",
        )
    if x_user_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid X-User-Id")
    return x_user_id
