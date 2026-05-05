import datetime
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.middlewares import get_current_user
from app.dependencies import get_db
from app.models import User, Task, TaskOrder
from .schemas import (
    AllTasksResponse,
    TaskOrderResponse,
    TaskResponse,
    CreateTaskRequest,
    CreateTaskResponse,
    UpdateTaskResponse,
    UpdateTaskRequest,
    ReorderTasksRequest,
)

router = APIRouter(prefix="/api", tags=["pomodoro"])


@router.get("/tasks")
async def get_all_tasks(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    date: str | None = None,
) -> AllTasksResponse:
    try:
        check_date = date or datetime.date.today().isoformat()
        result = await db.execute(
            select(Task).where(Task.userId == user.id, Task.dueDate == check_date)
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


@router.get("/tasks/orders")
async def get_task_orders(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    date: str | None = None,
) -> TaskOrderResponse:
    try:
        today = date or datetime.date.today().isoformat()
        result = await db.execute(
            select(TaskOrder).where(
                TaskOrder.userId == user.id, TaskOrder.date == today
            )
        )
        task_order = result.scalar_one_or_none()

        if not task_order:
            # find all tasks for today and return their ids in order of creation
            tasks = await db.execute(
                select(Task)
                .where(Task.userId == user.id, Task.dueDate == today)
                .order_by(Task.createdAt)
            )
            return TaskOrderResponse(
                order_task_ids=[task.id for task in tasks.scalars().all()]
            )

        order_task_ids = (
            task_order.orderTaskIds.split(",") if task_order.orderTaskIds else []
        )
        return TaskOrderResponse(order_task_ids=order_task_ids)
    except:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.patch("/tasks/orders")
async def reorder_tasks(
    reorder_request: ReorderTasksRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> TaskOrderResponse:
    try:
        check_date = reorder_request.date or datetime.date.today().isoformat()
        result = await db.execute(
            select(TaskOrder).where(
                TaskOrder.userId == user.id, TaskOrder.date == check_date
            )
        )
        taskResults = await db.execute(
            select(Task).where(Task.userId == user.id, Task.dueDate == check_date)
        )
        tasks = taskResults.scalars().all()

        if len(tasks) != len(reorder_request.order_task_ids):
            raise HTTPException(
                status_code=400,
                detail="The number of task IDs provided does not match the number of tasks for the specified date.",
            )

        if len(set(reorder_request.order_task_ids)) != len(
            reorder_request.order_task_ids
        ):
            raise HTTPException(
                status_code=400,
                detail="Duplicate task IDs are not allowed in the order.",
            )

        for task_id in reorder_request.order_task_ids:
            if task_id not in [task.id for task in tasks]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Task ID {task_id} is not valid for the specified date.",
                )

        task_order = result.scalar_one_or_none()

        if not task_order:
            task_order = TaskOrder(
                userId=user.id,
                date=check_date,
                orderTaskIds=",".join(reorder_request.order_task_ids),
            )
            db.add(task_order)
        else:
            task_order.orderTaskIds = ",".join(reorder_request.order_task_ids)

        await db.commit()
        await db.refresh(task_order)

        return TaskOrderResponse(order_task_ids=reorder_request.order_task_ids)
    except HTTPException:
        raise
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
            dueDate=task.due_date or datetime.date.today().isoformat(),
            userId=user.id,
            createdAt=datetime.date.today().isoformat(),
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
            existing_task.dueDate = datetime.date.today().isoformat()

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
