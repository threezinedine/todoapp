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
from urllib.parse import urlsplit, urlunsplit


def _load_env_file(env: dict[str, str], env_file: str) -> None:
    if not os.path.exists(env_file):
        return

    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip()
                os.environ.setdefault(key, value)
                env.setdefault(key, value)


def _running_in_docker() -> bool:
    return os.path.exists("/.dockerenv")


def _normalize_database_url_for_local(database_url: str) -> str:
    """Translate Docker service hostnames to localhost for host-machine runs."""
    if _running_in_docker():
        return database_url

    try:
        parsed = urlsplit(database_url)
    except ValueError:
        return database_url

    if parsed.hostname != "database":
        return database_url

    port = parsed.port or 3306
    username = parsed.username or ""
    password = parsed.password or ""

    userinfo = username
    if password:
        userinfo += f":{password}"
    if userinfo:
        userinfo += "@"

    netloc = f"{userinfo}localhost:{port}"
    return urlunsplit(
        (parsed.scheme, netloc, parsed.path, parsed.query, parsed.fragment)
    )


def main() -> None:
    migration_args = sys.argv[1:]

    env = os.environ.copy()
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    _load_env_file(env, env_file)

    database_url = env.get("MIGRATION_DATABASE_URL") or env.get("DATABASE_URL")
    if database_url:
        env["DATABASE_URL"] = _normalize_database_url_for_local(database_url)

    server_dir = os.path.join(os.path.dirname(__file__), "server")
    cmd = ["uv", "run", "alembic"] + migration_args

    result = subprocess.run(cmd, cwd=server_dir, env=env)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
