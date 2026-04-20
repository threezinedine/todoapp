from datetime import date
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.middlewares import get_current_user
from app.dependencies import get_db
from app.models import User, Task
from .schemas import (
    AllTasksResponse,
    TaskResponse,
    CreateTaskRequest,
    CreateTaskResponse,
    UpdateTaskResponse,
    UpdateTaskRequest,
)

router = APIRouter(prefix="/api", tags=["pomodoro"])


@router.get("/tasks")
async def get_all_tasks(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> AllTasksResponse:
    try:
        today = date.today().isoformat()
        result = await db.execute(
            select(Task).where(Task.userId == user.id, Task.dueDate == today)
        )
        tasks = result.scalars().all()

        respondTasks = [
            TaskResponse(
                id=task.id,
                name=task.name,
                description=task.description,
                due_date=task.dueDate,
            )
            for task in tasks
        ]

        return AllTasksResponse(tasks=respondTasks)
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/tasks/{task_id}")
async def get_task_by_id(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> TaskResponse:
    try:
        result = await db.execute(
            select(Task).where(Task.id == task_id, Task.userId == user.id)
        )
        task = result.scalar_one_or_none()

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        return TaskResponse(
            id=task.id,
            name=task.name,
            description=task.description,
            due_date=task.dueDate,
            completed=task.isCompleted,
        )
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/tasks")
async def create_task(
    task: CreateTaskRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> CreateTaskResponse:
    try:
        new_task = Task(
            id=str(uuid.uuid4()),
            name=task.name,
            description=task.description,
            dueDate=task.due_date or date.today().isoformat(),
            userId=user.id,
        )
        db.add(new_task)
        await db.commit()
        await db.refresh(new_task)

        return CreateTaskResponse(
            task=TaskResponse(
                id=new_task.id,
                name=new_task.name,
                description=new_task.description,
                due_date=new_task.dueDate,
                completed=new_task.isCompleted,
            )
        )
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.put("/tasks/{task_id}")
async def update_task(
    task_id: str,
    task: UpdateTaskRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> UpdateTaskResponse:
    try:
        result = await db.execute(
            select(Task).where(Task.id == task_id, Task.userId == user.id)
        )
        existing_task = result.scalar_one_or_none()

        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")

        if task.name is not None:
            existing_task.name = task.name

        if task.description is not None:
            existing_task.description = task.description

        if task.due_date is not None:
            existing_task.dueDate = task.due_date
        else:
            existing_task.dueDate = date.today().isoformat()

        await db.commit()
        await db.refresh(existing_task)

        return UpdateTaskResponse(
            task=TaskResponse(
                id=existing_task.id,
                name=existing_task.name,
                description=existing_task.description,
                due_date=existing_task.dueDate,
                completed=existing_task.isCompleted,
            )
        )
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/tasks/{task_id}/toggle")
async def toggle_task_completion(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> TaskResponse:
    try:
        result = await db.execute(
            select(Task).where(Task.id == task_id, Task.userId == user.id)
        )
        existing_task = result.scalar_one_or_none()

        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")

        existing_task.isCompleted = not existing_task.isCompleted

        await db.commit()
        await db.refresh(existing_task)

        return TaskResponse(
            id=existing_task.id,
            name=existing_task.name,
            description=existing_task.description,
            due_date=existing_task.dueDate,
            completed=existing_task.isCompleted,
        )
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    try:
        result = await db.execute(
            select(Task).where(Task.id == task_id, Task.userId == user.id)
        )
        existing_task = result.scalar_one_or_none()

        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")

        await db.delete(existing_task)
        await db.commit()

        return {"detail": "Task deleted successfully"}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")
