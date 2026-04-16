from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import engine
from app.features import authenticate
from app.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(authenticate.router)

app.add_api_route("/api/health", lambda: {"status": "ok"})


if __name__ == "__main__":
    import argparse

    import uvicorn

    parser = argparse.ArgumentParser(description="Run the FastAPI server.")
    parser.add_argument(
        "--port", type=int, default=8000, help="Port to run the server on"
    )
    parser.add_argument(
        "--volume-reload",
        action="store_true",
        help="Enable auto-reload for development (requires uvicorn[standard])",
    )
    args = parser.parse_args()

    uvicorn.run("main:app", host="0.0.0.0", port=args.port, reload=args.volume_reload)
