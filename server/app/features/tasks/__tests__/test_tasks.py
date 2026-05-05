import pytest
from httpx import AsyncClient
from datetime import date, datetime, timedelta
from app.contants import TEST_AUTH_HEADER


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
        headers=TEST_AUTH_HEADER,
    )
    assert response.status_code == 200
    assert "tasks" in response.json()


@pytest.mark.asyncio
async def test_get_all_tasks_with_date_filter_returns_200(client: AsyncClient):
    response = await client.get(
        f"/api/tasks?date={(date.today() + timedelta(days=1)).isoformat()}",
        headers=TEST_AUTH_HEADER,
    )
    assert response.status_code == 200
    assert "tasks" in response.json()
    assert (
        response.json()["tasks"] == []
    )  # Assuming there are no tasks for tomorrow in the test database


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
async def test_create_task_without_due_date_use_today_as_default(client: AsyncClient):
    """Calling POST /api/tasks without a due_date should default to today's date."""
    response = await client.post(
        "/api/tasks",
        json={
            "name": "Test Task Without Due Date",
            "description": "This task should default to today's date",
        },
        headers=TEST_AUTH_HEADER,
    )

    assert response.status_code == 200
    assert response.json()["task"]["due_date"] == date.today().isoformat()


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
        headers=TEST_AUTH_HEADER,
    )
    assert response.status_code == 200
    task = response.json().get("task", {})
    assert task.get("name") == "Test Task"
    assert task.get("description") == "This is a test task"
    assert task.get("due_date") == "2024-06-30"


@pytest.mark.asyncio
async def test_update_task_with_invalid_token_returns_401(client: AsyncClient):
    """Calling PUT /api/tasks/{task_id} without an Authorization header returns 401."""
    response = await client.put(
        "/api/tasks/some-task-id",
        json={
            "name": "Updated Task Name",
            "description": "Updated description",
            "due_date": "2024-07-31",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_task_with_valid_token_returns_200(client: AsyncClient):
    """Calling PUT /api/tasks/{task_id} with a valid token updates the task and returns 200."""
    # First, create a task to update
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Task to Update",
            "description": "This task will be updated",
            "due_date": "2024-06-30",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert create_response.status_code == 200
    created_task = create_response.json().get("task", {})
    task_id = created_task.get("id")

    # Now, update the task
    update_response = await client.put(
        f"/api/tasks/{task_id}",
        json={
            "name": "Updated Task Name",
            "description": "Updated description",
            "due_date": "2024-07-31",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert update_response.status_code == 200
    updated_task = update_response.json().get("task", {})
    assert updated_task.get("name") == "Updated Task Name"
    assert updated_task.get("description") == "Updated description"
    assert updated_task.get("due_date") == "2024-07-31"

    # Verify that the task was actually updated by retrieving it
    get_response = await client.get(
        f"/api/tasks/{task_id}",
        headers={"Authorization": "Bearer valid-test-token"},
    )
    assert get_response.status_code == 200
    retrieved_task = get_response.json()
    assert retrieved_task.get("name") == "Updated Task Name"
    assert retrieved_task.get("description") == "Updated description"
    assert retrieved_task.get("due_date") == "2024-07-31"


@pytest.mark.asyncio
async def test_get_task_by_id_without_valid_token_returns_401(client: AsyncClient):
    """Calling GET /api/tasks/{task_id} without a valid token returns 401."""
    response = await client.get(
        "/api/tasks/some-task-id",
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_delete_task_with_valid_token_returns_200(client: AsyncClient):
    """Calling DELETE /api/tasks/{task_id} with a valid token deletes the task and returns 200."""
    # First, create a task to delete
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Task to Delete",
            "description": "This task will be deleted",
            "due_date": "2024-06-30",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert create_response.status_code == 200
    created_task = create_response.json().get("task", {})
    task_id = created_task.get("id")

    # Now, delete the task
    delete_response = await client.delete(
        f"/api/tasks/{task_id}",
        headers=TEST_AUTH_HEADER,
    )
    assert delete_response.status_code == 200

    # Verify that the task was actually deleted by trying to retrieve it
    get_response = await client.get(
        f"/api/tasks/{task_id}",
        headers=TEST_AUTH_HEADER,
    )
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_toggle_task_completion_with_invalid_token_returns_401(
    client: AsyncClient,
):
    """Calling POST /api/tasks/{task_id}/toggle without a valid token returns 401."""
    response = await client.post(
        "/api/tasks/some-task-id/toggle",
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_toggle_task_completion_with_valid_token_returns_200(client: AsyncClient):
    """Calling POST /api/tasks/{task_id}/toggle with a valid token toggles completion and returns 200."""
    # First, create a task to toggle
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Task to Toggle",
            "description": "This task will have its completion toggled",
            "due_date": "2024-06-30",
        },
        headers=TEST_AUTH_HEADER,
    )

    assert create_response.status_code == 200

    # Now, toggle the task's completion status
    created_task = create_response.json().get("task", {})
    task_id = created_task.get("id")
    toggle_response = await client.post(
        f"/api/tasks/{task_id}/toggle",
        headers=TEST_AUTH_HEADER,
    )
    assert toggle_response.status_code == 200
    toggled_task = toggle_response.json()
    assert toggled_task.get("completed") is True


@pytest.mark.asyncio
async def test_update_nonexistent_task_returns_404(client: AsyncClient):
    """Calling PUT /api/tasks/{nonexistent_task_id} with a valid token returns 404."""
    response = await client.put(
        "/api/tasks/nonexistent-task-id",
        json={
            "name": "Updated Task Name",
            "description": "Updated description",
            "due_date": "2024-07-31",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_other_accounts_task_returns_404(client: AsyncClient):
    """Calling PUT /api/tasks/{task_id} for a task that belongs to another user returns 404."""
    # First, create a task with the default user
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Task Owned by Default User",
            "description": "This task is owned by the default user",
            "due_date": "2024-06-30",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert create_response.status_code == 200
    created_task = create_response.json().get("task", {})
    task_id = created_task.get("id")

    # Now, try to update the task using the second user's token
    response = await client.put(
        f"/api/tasks/{task_id}",
        json={
            "name": "Updated Task Name",
            "description": "Updated description",
            "due_date": "2024-07-31",
        },
        headers={"Authorization": "Bearer valid-test-token-2"},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_task_returns_404(client: AsyncClient):
    """Calling DELETE /api/tasks/{nonexistent_task_id} with a valid token returns 404."""
    response = await client.delete(
        "/api/tasks/nonexistent-task-id",
        headers=TEST_AUTH_HEADER,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_other_accounts_task_returns_404(client: AsyncClient):
    """Calling DELETE /api/tasks/{task_id} for a task that belongs to another user returns 404."""
    # First, create a task with the default user
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Task Owned by Default User",
            "description": "This task is owned by the default user",
            "due_date": "2024-06-30",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert create_response.status_code == 200
    created_task = create_response.json().get("task", {})
    task_id = created_task.get("id")

    # Now, try to delete the task using the second user's token
    response = await client.delete(
        f"/api/tasks/{task_id}",
        headers={"Authorization": "Bearer valid-test-token-2"},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_toggle_other_accounts_task_returns_404(client: AsyncClient):
    """Calling POST /api/tasks/{task_id}/toggle for a task that belongs to another user returns 404."""
    # First, create a task with the default user
    create_response = await client.post(
        "/api/tasks",
        json={
            "name": "Task Owned by Default User",
            "description": "This task is owned by the default user",
            "due_date": "2024-06-30",
        },
        headers=TEST_AUTH_HEADER,
    )
    assert create_response.status_code == 200
    created_task = create_response.json().get("task", {})
    task_id = created_task.get("id")

    # Now, try to toggle the task using the second user's token
    response = await client.post(
        f"/api/tasks/{task_id}/toggle",
        headers={"Authorization": "Bearer valid-test-token-2"},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_non_existed_task_order_date_returns_order_by_created_time(
    client: AsyncClient,
):
    """Calling GET /api/tasks/order with a valid token but no order for today should return tasks ordered by created time."""
    task_ids: list[str] = []
    for i in range(3):
        create_response = await client.post(
            "/api/tasks",
            json={
                "name": f"Task {i+1}",
                "description": f"Task number {i+1}",
                "due_date": date.today().isoformat(),
            },
            headers=TEST_AUTH_HEADER,
        )
        assert create_response.status_code == 200
        created_task = create_response.json().get("task", {})
        task_ids.append(created_task.get("id"))

    response = await client.get(
        "/api/tasks/orders",
        headers=TEST_AUTH_HEADER,
    )
    assert response.status_code == 200
    assert response.json().get("order_task_ids") == task_ids


@pytest.mark.asyncio
async def test_get_task_order_with_invalid_token_returns_401(client: AsyncClient):
    """Calling GET /api/tasks/order without a valid token returns 401."""
    response = await client.get(
        "/api/tasks/orders",
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_task_order_with_valid_token_returns_200(client: AsyncClient):
    """Calling PATCH /api/tasks/order with a valid token updates the task order and returns 200."""
    # First, create some tasks to reorder
    task_ids: list[str] = []
    for i in range(3):
        create_response = await client.post(
            "/api/tasks",
            json={
                "name": f"Task {i+1}",
                "description": f"Task number {i+1}",
                "due_date": date.today().isoformat(),
            },
            headers=TEST_AUTH_HEADER,
        )
        assert create_response.status_code == 200
        created_task = create_response.json().get("task", {})
        task_ids.append(created_task.get("id"))

    # Now, update the task order
    new_order = [task_ids[2], task_ids[0], task_ids[1]]
    update_response = await client.patch(
        "/api/tasks/orders",
        json={"order_task_ids": new_order},
        headers=TEST_AUTH_HEADER,
    )
    assert update_response.status_code == 200
    assert update_response.json().get("order_task_ids") == new_order

    # Verify that the order was actually updated by retrieving it
    get_response = await client.get(
        "/api/tasks/orders",
        headers=TEST_AUTH_HEADER,
    )
    assert get_response.status_code == 200
    assert get_response.json().get("order_task_ids") == new_order


@pytest.mark.asyncio
async def test_update_task_order_with_invalid_token_returns_401(client: AsyncClient):
    """Calling PATCH /api/tasks/order without a valid token returns 401."""
    response = await client.patch(
        "/api/tasks/orders",
        json={"order_task_ids": ["some-task-id-1", "some-task-id-2"]},
    )
    assert response.status_code == 401
