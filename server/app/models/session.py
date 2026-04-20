from sqlalchemy import ForeignKey, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String(64), unique=True, primary_key=True)
    userId: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"))
    taskId: Mapped[str] = mapped_column(String(64), ForeignKey("tasks.id"))
    startTime: Mapped[DateTime] = mapped_column(DateTime)  # ISO format date string
    stopTime: Mapped[DateTime] = mapped_column(
        DateTime, nullable=True
    )  # ISO format date string

    user = relationship("User")
    task = relationship("Task")
