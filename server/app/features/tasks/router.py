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
            id=new_task.id,
            name=new_task.name,
            description=new_task.description,
            due_date=new_task.dueDate,
            is_completed=new_task.isCompleted,
        )
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")
