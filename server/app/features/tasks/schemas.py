from pydantic import BaseModel


class AllTasksRequest(BaseModel):
    pass


class TaskResponse(BaseModel):
    id: str
    name: str
    description: str
    due_date: str | None = None
    completed: bool = False
    template_id: str | None = None


class AllTasksResponse(BaseModel):
    tasks: list[TaskResponse]


class TaskOrderResponse(BaseModel):
    order_task_ids: list[str]


class CreateTaskRequest(BaseModel):
    name: str
    description: str
    due_date: str | None = None


class CreateTaskResponse(BaseModel):
    task: TaskResponse


class UpdateTaskRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    due_date: str | None = None


class UpdateTaskResponse(BaseModel):
    task: TaskResponse
