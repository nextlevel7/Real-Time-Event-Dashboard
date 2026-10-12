# Real-Time Event Dashboard & API

A real-time event ingestion, search, and analytics dashboard built with **FastAPI**, **PostgreSQL**, **SQLAlchemy 2.0**, and **React + TypeScript + Tailwind CSS**.


## How to Run

### Run Everything with Docker Compose
```bash
cp .env.example .env
docker compose up --build
```
- **Frontend Dashboard**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`

---



## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/events` | Ingest an event (`{ id, user_id, event_type, payload, timestamp }`). Returns `201` or `409` on duplicate ID. |
| `GET` | `/api/events` | Paginated events (`page`, `limit`, `event_type`, `start_date`, `end_date`, `search`). |
| `GET` | `/api/events/analytics` | Event counts grouped by `event_type` over the last 24 hours. |
| `GET` | `/health` | Health check (`{"status": "ok"}`). |


---

## 4. Running Tests

```bash
cd backend
uv run pytest
```
