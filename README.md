# TodoApp

A full-stack todo application built with React (TypeScript), FastAPI, and Docker.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: FastAPI (Python 3.12)
- **Web Server**: Nginx
- **Testing**: Playwright (E2E)
- **Containerization**: Docker Compose

## Project Structure

```text
todoapp/
├── client/          # React frontend
├── server/          # FastAPI backend
├── nginx/           # Nginx configuration
├── e2e/             # End-to-end Playwright tests
└── docker-compose.yml
```

## Quick Start

### Production

```bash
docker compose up --build
```

The app will be available at `http://localhost:8000`.

### Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

This runs the frontend with hot-reload and the backend with auto-reload.

### Running E2E Tests

```bash
# Run tests in headless mode
python e2e.py

# Open Playwright UI for interactive testing
python e2e.py --ui
```

## API

| Endpoint      | Method | Description  |
| ------------- | ------ | ------------ |
| `/api/health` | GET    | Health check |

## License

MIT © Nguyễn Thế Thảo (2026)
