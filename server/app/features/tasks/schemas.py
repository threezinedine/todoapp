from pydantic import BaseModel


class AllTasksRequest(BaseModel):
    pass


class CreateTaskRequest(BaseModel):
    name: str
    description: str
    due_date: str


class CreateTaskResponse(BaseModel):
    id: str
    name: str
    description: str
    due_date: str
    is_completed: bool


class TaskResponse(BaseModel):
    id: str
    name: str
    description: str
    due_date: str
    completed: bool = False
    template_id: str | None = None


class AllTasksResponse(BaseModel):
    tasks: list[TaskResponse]
