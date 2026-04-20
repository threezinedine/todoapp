from pydantic import BaseModel


class VerifyRequest(BaseModel):
    pass


class UserResponse(BaseModel):
    id: str
    username: str
    email: str


class VerifyResponse(BaseModel):
    message: str
    user: UserResponse
