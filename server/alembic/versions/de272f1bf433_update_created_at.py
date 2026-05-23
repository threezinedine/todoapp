"""Update created At

Revision ID: de272f1bf433
Revises: d9c8197e1b14
Create Date: 2026-05-23 21:34:58.011117

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de272f1bf433'
down_revision: Union[str, Sequence[str], None] = 'd9c8197e1b14'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
