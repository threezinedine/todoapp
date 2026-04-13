## For now, just check if the user auth is the secret key which is stored in the
## environment variable. In the future, we can implement a more robust authentication system.

import os
from fastapi import Header, HTTPException


def get_auth(authorization: str = Header(...)) -> None:
    secret_key = os.getenv("SECRET_KEY")
    if authorization != secret_key:
        raise HTTPException(status_code=401, detail="Unauthorized")
