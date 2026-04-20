from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


# repeatType:
# 0: Daily    - repeat every day, can choose times
# 1: Weekly   - can choose the taks instances for each weekday.
# 2: Periodic - can choose the period of repetition, e.g. every 3 days, every 2 weeks, etc.


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(String(64), unique=True, primary_key=True)
    userId: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(255))
    repeatType: Mapped[int] = mapped_column(default=0)
    repeatSettings: Mapped[str] = mapped_column(
        String(255)
    )  # JSON string to store the repeat settings

    user = relationship("User", back_populates="templates")
    tasks = relationship("Task", back_populates="template")
    categories = relationship("CategoryTemplate", back_populates="template")
