import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_all_tasks_without_token_returns_401(client: AsyncClient):
    """Calling /api/tasks without an Authorization header returns 401."""
    response = await client.get("/api/tasks")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_all_tasks_returns_200_with_valid_token(client: AsyncClient):
    """Calling /api/tasks with a valid token returns 200 and a list of tasks."""
    response = await client.get(
        "/api/tasks",
        headers={"Authorization": "Bearer valid-test-token"},
    )
    print(response.json())
    assert response.status_code == 200
    assert "tasks" in response.json()


@pytest.mark.asyncio
async def test_create_task_without_token_returns_401(client: AsyncClient):
    """Calling POST /api/tasks without an Authorization header returns 401."""
    response = await client.post(
        "/api/tasks",
        json={
            "name": "Test Task",
            "description": "This is a test task",
            "due_date": "2024-06-30",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_task_with_valid_token_returns_200(client: AsyncClient):
    """Calling POST /api/tasks with a valid token creates a task and returns 200."""
    response = await client.post(
        "/api/tasks",
        json={
            "name": "Test Task",
            "description": "This is a test task",
            "due_date": "2024-06-30",
        },
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Task"
    assert response.json()["description"] == "This is a test task"
    assert response.json()["due_date"] == "2024-06-30"
