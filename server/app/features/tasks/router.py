from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db

router = APIRouter(prefix="/api/auth", tags=["authenticate"])


@router.get("/tasks")
def get_all_tasks(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    return {"message": "This is a protected route that returns all tasks."}
