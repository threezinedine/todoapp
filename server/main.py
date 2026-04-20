import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import select

from app.database import engine, async_session_maker
from app.features import authenticate, tasks
from app.models import Base, User


async def create_default_user():
    """Create a default user if it doesn't exist."""
    async with async_session_maker() as session:
        # Check if default user exists
        result = await session.execute(select(User).where(User.username == "default"))
        existing_user = result.scalar_one_or_none()

        if not existing_user:
            default_user = User(
                id=str(uuid.uuid4()),
                username="default",
                email="default@todoapp.local",
                hashed_password="",  # No password needed for default user
            )
            session.add(default_user)
            await session.commit()

        result = await session.execute(select(User).where(User.username == "default-2"))
        existing_user_2 = result.scalar_one_or_none()

        if not existing_user_2:
            default_user_2 = User(
                id=str(uuid.uuid4()),
                username="default-2",
                email="default-2@todoapp.local",
                hashed_password="",  # No password needed for default user
            )
            session.add(default_user_2)
            await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await create_default_user()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(authenticate.router)
app.include_router(tasks.router)

app.add_api_route("/api/health", lambda: {"status": "ok"})


if __name__ == "__main__":
    import argparse

    import uvicorn

    parser = argparse.ArgumentParser(description="Run the FastAPI server.")
    parser.add_argument(
        "--port", type=int, default=8000, help="Port to run the server on"
    )
    parser.add_argument(
        "--volume-reload",
        action="store_true",
        help="Enable auto-reload for development (requires uvicorn[standard])",
    )
    args = parser.parse_args()

    uvicorn.run("main:app", host="0.0.0.0", port=args.port, reload=args.volume_reload)
