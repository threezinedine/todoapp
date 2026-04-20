import os
import uuid
from typing import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

os.environ.setdefault("DEFAULT_TOKEN", "valid-test-token")

# Use SQLite for testing (in-memory database)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

from app.database import async_session_maker as prod_session_maker
from app.dependencies import get_db
from app.models import Base, User


@pytest_asyncio.fixture
async def test_engine():
    """Create an in-memory SQLite engine for testing."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False},
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def test_session_maker(test_engine):
    """Create a session maker for the test database."""
    return async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture
async def test_db_session(test_session_maker):
    """Create a database session and a default user."""
    async with test_session_maker() as session:
        # Create default user
        default_user = User(
            id=str(uuid.uuid4()),
            username="default",
            email="default@todoapp.local",
            hashed_password="",
        )
        session.add(default_user)
        await session.commit()
        yield session


@pytest_asyncio.fixture
async def client(
    test_session_maker, test_db_session
) -> AsyncGenerator[AsyncClient, None]:
    """Create a test client with mocked dependencies."""
    from main import app

    async def override_get_db():
        async with test_session_maker() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
