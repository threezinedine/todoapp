"""createTaskOrder

Revision ID: 796d1ae62978
Revises: 26f9a2c3339d
Create Date: 2026-05-04 07:18:07.317132

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '796d1ae62978'
down_revision: Union[str, Sequence[str], None] = '26f9a2c3339d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
