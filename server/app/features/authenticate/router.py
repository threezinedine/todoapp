import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.features.authenticate.schemas import (
    VerifyRequest,
    VerifyResponse,
    UserResponse,
)
from app.models import User

router = APIRouter(prefix="/api/auth", tags=["authenticate"])


@router.post("/verify")
async def verify_token(
    request: VerifyRequest,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    assert os.getenv("DEFAULT_TOKEN") is not None

    token = credentials.credentials
    # Verify token matches DEFAULT_TOKEN
    if token != os.getenv("DEFAULT_TOKEN"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    # Fetch the default user
    result = await db.execute(select(User).where(User.username == "default"))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Default user not found",
        )

    return VerifyResponse(
        message="Token is valid",
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
        ),
    )
