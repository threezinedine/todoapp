import logging
from typing import Annotated
import uuid
import os
import datetime
import asyncio
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.models import User, Session, Task
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.dependencies import get_db

router = APIRouter(prefix="/api", tags=["sessions"])


async def _get_current_user_ws(websocket: WebSocket, db: AsyncSession) -> User | None:
    auth_header = websocket.headers.get("Authorization", "")
    token = None

    if auth_header.startswith("Bearer "):
        token = auth_header[len("Bearer ") :]
    else:
        token = websocket.query_params.get("token")

    if not token:
        await websocket.close(
            code=1008, reason="Missing or invalid Authorization header or token"
        )
        return None

    secret_key = os.getenv("DEFAULT_TOKEN")
    secret_key_2 = os.getenv("DEFAULT_TOKEN_2")

    if token != secret_key and token != secret_key_2:
        await websocket.close(code=1008, reason="Invalid token")
        return None

    username = "default" if token == secret_key else "default-2"
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()

    if not user:
        await websocket.close(code=1011, reason="User not found")
        return None

    return user


@router.websocket("/sessions/{task_id}")
async def join_session(
    task_id: str,
    websocket: WebSocket,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    await websocket.accept()

    task = None
    session = None
    timeoutTask = None
    state = "idle"

    try:
        user = await _get_current_user_ws(websocket, db)
        if user is None:
            return

        task_result = await db.execute(select(Task).where(Task.id == task_id))
        task = task_result.scalar_one_or_none()

        if task is None:
            await websocket.close(code=1008, reason="Task not found")
            return

        if task.remainSeconds <= 0:
            await websocket.close(code=1008, reason="Task has no remaining time")
            return

        async def taskTimeout(remainSeconds):
            await asyncio.sleep(remainSeconds)
            if websocket.client_state.name == "CONNECTED":
                if session is not None:
                    session.stopTime = datetime.datetime.utcnow()
                    await db.commit()
                    session = None

                if task is not None:
                    task.remainSeconds = 0
                    task.isCompleted = True
                    await db.commit()
                    task = None

                await websocket.close(code=1000, reason="Task time expired")

        while True:
            data = await websocket.receive_text()

            if data == "ping":
                curr_remaiin = task.remainSeconds

                if session:
                    elapsed_seconds = (
                        datetime.datetime.utcnow() - session.startTime
                    ).total_seconds()
                    curr_remaiin = max(0, curr_remaiin - int(elapsed_seconds))

                await websocket.send_text(str(curr_remaiin))
            elif data == "start":
                if state == "started":
                    continue

                if task.isCompleted:
                    await websocket.close(code=1008, reason="Task is already completed")
                    return

                session = Session(
                    id=str(uuid.uuid4()),
                    taskId=task_id,
                    userId=user.id,
                    startTime=datetime.datetime.utcnow(),
                )

                db.add(session)
                await db.commit()

                timeoutTask = asyncio.create_task(taskTimeout(task.remainSeconds))

                logging.info(
                    f"Start session {session.id} for user {user.id} on task {task_id}"
                )

                state = "started"

            elif data == "stop":
                if state == "idle":
                    continue

                if session:
                    session.stopTime = datetime.datetime.utcnow()
                    await db.commit()
                    logging.info(
                        f"Stop session {session.id} for user {user.id} on task {task_id}"
                    )

                    task.remainSeconds = max(
                        0,
                        task.remainSeconds
                        - int((session.stopTime - session.startTime).total_seconds()),
                    )
                    session = None

                    if timeoutTask:
                        timeoutTask.cancel()
                        timeoutTask = None

                    if task.remainSeconds == 0:
                        task.isCompleted = True
                    await db.commit()

                    task = (
                        await db.execute(select(Task).where(Task.id == task_id))
                    ).scalar_one_or_none()

                    if task is None:
                        await websocket.close(code=1008, reason="Task not found")
                        return

                    state = "idle"
                else:
                    await websocket.close(code=1008, reason="No active session to stop")
    except WebSocketDisconnect:
        logging.info(f"User {user.id} has left session {session.id}")
    except Exception as e:
        logging.info(f"Error in session {session.id}: {e}")
    finally:
        if task is not None and session is not None and not task.isCompleted:
            elapsed_seconds = (
                datetime.datetime.utcnow() - session.startTime
            ).total_seconds()
            task.remainSeconds = max(0, task.remainSeconds - int(elapsed_seconds))
            if task.remainSeconds == 0:
                task.isCompleted = True
        if session:
            session.stopTime = datetime.datetime.utcnow()

        if timeoutTask:
            timeoutTask.cancel()

        await db.commit()
