import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.features.authenticate.schemas import (
    VerifyRequest,
)

router = APIRouter(prefix="/api/auth", tags=["authenticate"])


@router.post("/verify")
async def verify_token(
    request: VerifyRequest,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
):
    assert os.getenv("DEFAULT_TOKEN") is not None

    token = credentials.credentials
    # Here you would implement your token verification logic, e.g., using JWT
    # For demonstration, we'll just check if the token is "valid-token"
    if token != os.getenv("DEFAULT_TOKEN"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return {"message": "Token is valid"}
