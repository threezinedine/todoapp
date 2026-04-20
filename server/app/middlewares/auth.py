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

    if credentials.credentials != secret_key:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    result = await db.execute(select(User).where(User.username == "default"))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=500, detail="Default user not found")

    return user
