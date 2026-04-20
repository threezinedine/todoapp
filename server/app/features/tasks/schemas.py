from pydantic import BaseModel
from datetime import datetime as Datetime


class AllTasksRequest(BaseModel):
    date: Datetime


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    due_date: str
    completed: bool
    template_id: str | None


class AllTasksResponse(BaseModel):
    tasks: list[TaskResponse]
