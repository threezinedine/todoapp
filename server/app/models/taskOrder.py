from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class TaskOrder(Base):
    __tablename__ = "task_orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    userId: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"))
    date: Mapped[str] = mapped_column(String(10))  # ISO format date string (YYYY-MM-DD)
    orderTaskIds: Mapped[str] = mapped_column(
        String(2000)
    )  # Comma-separated list of task IDs
