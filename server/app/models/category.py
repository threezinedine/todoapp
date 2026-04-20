from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(64), unique=True, primary_key=True)
    userId: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(50), index=True)
    description: Mapped[str] = mapped_column(String(255))
    color: Mapped[str] = mapped_column(String(20))  # e.g. "#FF5733", "#33FF57", etc.

    user = relationship("User", back_populates="categories")
    tasks = relationship("CategoryTask", back_populates="category")
    templates = relationship("CategoryTemplate", back_populates="category")
