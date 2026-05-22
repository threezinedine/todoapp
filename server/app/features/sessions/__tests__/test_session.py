from fastapi import WebSocketDisconnect
import pytest


@pytest.mark.asyncio
async def test_session_lifecycle(ws_client):
    with ws_client.websocket_connect("/api/sessions/non-existent-task") as websocket:
        with pytest.raises(WebSocketDisconnect) as exc_info:
            websocket.receive_text()
            assert exc_info.value.code == 1008
            assert exc_info.value.reason == "Task not found"


@pytest.mark.asyncio
async def test_session_lifecycle_with_valid_task(
    ws_client,
    test_db_session,
    test_task_ids,
):
    # Get the ID of the first task created for the default user
    task_id = test_task_ids[0]

    with ws_client.websocket_connect(
        f"/api/sessions/{task_id}",
        headers={"Authorization": "Bearer valid-test-token"},
    ) as websocket:
        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"


@pytest.mark.asyncio
async def test_session_lifecycle_with_token_query_param(
    ws_client,
    test_db_session,
    test_task_ids,
):
    task_id = test_task_ids[0]

    with ws_client.websocket_connect(
        f"/api/sessions/{task_id}?token=valid-test-token",
    ) as websocket:
        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"
