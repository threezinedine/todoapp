"""update created at 2

Revision ID: bea2e90e7f05
Revises: de272f1bf433
Create Date: 2026-05-23 21:39:06.062535

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "bea2e90e7f05"
down_revision: Union[str, Sequence[str], None] = "de272f1bf433"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # update the createdAt column to have length 50 to accommodate ISO format datetime strings
    op.alter_column(
        "tasks",
        "createdAt",
        type_=sa.String(length=50),
        existing_type=sa.String(length=20),
    )
    pass


def downgrade() -> None:
    # revert the createdAt column back to length 20
    op.alter_column(
        "tasks",
        "createdAt",
        type_=sa.String(length=20),
        existing_type=sa.String(length=50),
    )
    pass
