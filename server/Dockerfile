FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN pip install uv
RUN uv sync --no-dev

COPY . .

EXPOSE 8000

CMD ["uv", "run", "main.py", "--port", "8000"]