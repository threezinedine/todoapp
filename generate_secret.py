#!/usr/bin/env python3
"""Generate a random secret key for use in environment variables."""

import secrets


def main() -> None:
    key = secrets.token_urlsafe(64)
    output = f"SECRET_KEY={key}"

    print(output)

if __name__ == "__main__":
    main()