from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class CategoryTask(Base):
    __tablename__ = "category_tasks"

    id: Mapped[str] = mapped_column(String(64), unique=True, primary_key=True)
    categoryId: Mapped[str] = mapped_column(String(64), ForeignKey("categories.id"))
    taskId: Mapped[str] = mapped_column(String(64), ForeignKey("tasks.id"))

    category = relationship("Category", back_populates="tasks")
    task = relationship("Task", back_populates="categories")
