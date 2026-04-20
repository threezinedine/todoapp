from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class CategoryTemplate(Base):
    __tablename__ = "category_templates"

    id: Mapped[str] = mapped_column(String(64), unique=True, primary_key=True)
    templateId: Mapped[str] = mapped_column(String(64), ForeignKey("templates.id"))
    categoryId: Mapped[str] = mapped_column(String(64), ForeignKey("categories.id"))

    template = relationship("Template", back_populates="categories")
    category = relationship("Category", back_populates="templates")
