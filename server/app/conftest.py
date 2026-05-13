import os
from fastapi.testclient import TestClient
import pytest
import uuid
from typing import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool
from .contants import *

os.environ.setdefault("DEFAULT_TOKEN", "valid-test-token")
os.environ.setdefault("DEFAULT_TOKEN_2", "valid-test-token-2")

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
        poolclass=StaticPool,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    # For in-memory SQLite, disposing the engine is sufficient cleanup.
    # Calling drop_all here can fail if the underlying async connection
    # has already been terminated by the test client's event loop teardown.
    await engine.dispose()


@pytest_asyncio.fixture
async def test_session_maker(test_engine):
    """Create a session maker for the test database."""
    return async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture
async def test_db_session(test_session_maker):
    """Seed default users for tests without holding a DB session open."""
    async with test_session_maker() as session:
        # Create default user
        default_user = User(
            id=str(uuid.uuid4()),
            username="default",
            email="default@todoapp.local",
            hashed_password="",
        )
        default_user_2 = User(
            id=str(uuid.uuid4()),
            username="default-2",
            email="default2@todoapp.local",
            hashed_password="",
        )
        session.add(default_user)
        session.add(default_user_2)
        await session.commit()

    yield


@pytest_asyncio.fixture
async def test_task_ids(test_db_session, client: AsyncClient):
    """Create some test tasks for the default user."""
    task_ids = []

    for i in range(3):
        response = await client.post(
            "/api/tasks",
            json={
                "name": f"Test Task {i+1}",
                "description": f"Description for task {i+1}",
                "due_date": None,
                "completed": False,
            },
            headers={"Authorization": "Bearer valid-test-token"},
        )
        assert response.status_code == 200
        task_ids.append(response.json()["task"]["id"])

    yield task_ids


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


@pytest.fixture
def ws_client(test_session_maker, test_db_session):
    """Create a test client for WebSocket testing."""
    from main import app

    async def override_get_db():
        async with test_session_maker() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    client = TestClient(app)
    yield client
    client.close()

    app.dependency_overrides.clear()
