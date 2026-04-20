## For now, just check if the user auth is the secret key which is stored in the
## environment variable. In the future, we can implement a more robust authentication system.

import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from typing import Annotated
from app.models import User


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
) -> User:
    secret_key = os.getenv("DEFAULT_TOKEN")
    secret_key_2 = os.getenv("DEFAULT_TOKEN_2")

    if (
        credentials.credentials != secret_key
        and credentials.credentials != secret_key_2
    ):
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    if credentials.credentials == secret_key:
        result = await db.execute(select(User).where(User.username == "default"))
    else:
        result = await db.execute(select(User).where(User.username == "default-2"))

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=500, detail="Default user not found")

    return user
