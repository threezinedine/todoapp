from typing import Annotated

from fastapi import APIRouter, Depends
from app.features.authenticate.schemas import (
    VerifyRequest,
    VerifyResponse,
    UserResponse,
)
from app.models import User
from app.middlewares.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["authenticate"])


@router.post("/verify")
async def verify_token(
    request: VerifyRequest,
    user: Annotated[User, Depends(get_current_user)],
):
    return VerifyResponse(
        message="Token is valid",
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
        ),
    )
