"""Migration CLI for the todoapp server.

Usage:
    python migrate.py --help
    python migrate.py revision --autogenerate -m "add priority column"
    python migrate.py upgrade head
    python migrate.py downgrade -1
"""
from __future__ import annotations

import os
import subprocess
import sys


def main() -> None:
    migration_args = sys.argv[1:]

    env = os.environ.copy()
    # Ensure DATABASE_URL is set from .env for local runs
    if "DATABASE_URL" not in env:
        env_file = os.path.join(os.path.dirname(__file__), ".env")
        if os.path.exists(env_file):
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, _, value = line.partition("=")
                        os.environ.setdefault(key.strip(), value.strip())
                        env.setdefault(key.strip(), value.strip())

    server_dir = os.path.join(os.path.dirname(__file__), "server")
    cmd = ["uv", "run", "alembic"] + migration_args

    result = subprocess.run(cmd, cwd=server_dir, env=env)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
