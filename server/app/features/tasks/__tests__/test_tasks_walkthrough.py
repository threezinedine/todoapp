import pytest
from httpx import AsyncClient
from datetime import date

from app.contants import TEST_AUTH_HEADER


@pytest.mark.asyncio
async def test_tasks_walkthrough(client: AsyncClient):
    """A walkthrough test that creates a task and then retrieves it."""
    # Empty the database before starting the test
    response = await client.get(
        "/api/tasks",
        headers=TEST_AUTH_HEADER,
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
        headers=TEST_AUTH_HEADER,
    )
    assert create_response.status_code == 200
    created_task = create_response.json().get("task", {})
    assert created_task.get("name") == "Walkthrough Task"
    assert (
        created_task.get("description") == "This task is created in a walkthrough test"
    )
    assert created_task.get("due_date") == date.today().isoformat()

    # Retrieve all tasks and check if the created task is in the list
    get_response = await client.get(
        "/api/tasks",
        headers=TEST_AUTH_HEADER,
    )
    assert get_response.status_code == 200
    tasks = get_response.json().get("tasks", [])
    assert len(tasks) == 1

    # Retrieve the created task by ID
    task_id = created_task.get("id")
    get_by_id_response = await client.get(
        f"/api/tasks/{task_id}",
        headers=TEST_AUTH_HEADER,
    )
    assert get_by_id_response.status_code == 200
    retrieved_task = get_by_id_response.json()
    assert retrieved_task.get("name") == "Walkthrough Task"
    assert (
        retrieved_task.get("description")
        == "This task is created in a walkthrough test"
    )
    assert retrieved_task.get("due_date") == date.today().isoformat()
    assert retrieved_task.get("completed") is False

    # Update the task
    update_response = await client.put(
        f"/api/tasks/{task_id}",
        headers=TEST_AUTH_HEADER,
        json={
            "name": "Updated Walkthrough Task",
            "description": "This task has been updated in the walkthrough test",
        },
    )
    assert update_response.status_code == 200
    updated_task = update_response.json().get("task", {})
    assert updated_task.get("name") == "Updated Walkthrough Task"
    assert (
        updated_task.get("description")
        == "This task has been updated in the walkthrough test"
    )
    assert updated_task.get("due_date") == date.today().isoformat()

    # Delete the task
    delete_response = await client.delete(
        f"/api/tasks/{task_id}",
        headers=TEST_AUTH_HEADER,
    )
    assert delete_response.status_code == 200

    # Verify the task has been deleted
    get_after_delete_response = await client.get(
        f"/api/tasks/{task_id}",
        headers=TEST_AUTH_HEADER,
    )
    assert get_after_delete_response.status_code == 404
