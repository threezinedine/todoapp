import pytest
from httpx import AsyncClient
from datetime import date


@pytest.mark.asyncio
async def test_tasks_walkthrough(client: AsyncClient):
    """A walkthrough test that creates a task and then retrieves it."""
    # Empty the database before starting the test
    response = await client.get(
        "/api/tasks",
        headers={"Authorization": "Bearer valid-test-token"},
    )
    tasks = response.json().get("tasks", [])
    assert response.status_code == 200
    assert len(tasks) == 0

    # Create a new task
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Walkthrough Task",
            "description": "This task is created in a walkthrough test",
        },
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert create_response.status_code == 200
    created_task = create_response.json()
    assert created_task["name"] == "Walkthrough Task"
    assert created_task["description"] == "This task is created in a walkthrough test"
    assert created_task["due_date"] == date.today().isoformat()

    # Retrieve all tasks and check if the created task is in the list
    get_response = await client.get(
        "/api/tasks",
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert get_response.status_code == 200
    tasks = get_response.json()["tasks"]
    assert len(tasks) == 1
    assert tasks[0]["name"] == "Walkthrough Task"
