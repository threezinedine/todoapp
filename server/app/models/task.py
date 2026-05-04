from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String(64), unique=True, primary_key=True)
    userId: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"))
    templateId: Mapped[str] = mapped_column(
        String(64), ForeignKey("templates.id"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(50), index=True)
    description: Mapped[str] = mapped_column(String(255))
    dueDate: Mapped[str] = mapped_column(
        String(10)
    )  # ISO format date string (YYYY-MM-DD)
    isCompleted: Mapped[bool] = mapped_column(default=False)
    remainSeconds: Mapped[int] = mapped_column(
        default=60 * 45
    )  # Remaining time in seconds
    createdAt: Mapped[str] = mapped_column(String(20))  # ISO format datetime string

    user = relationship("User", back_populates="tasks")
    template = relationship("Template", back_populates="tasks")
    categories = relationship("CategoryTask", back_populates="task")
    sessions = relationship("Session", back_populates="task")
