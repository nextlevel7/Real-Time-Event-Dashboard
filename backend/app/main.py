import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.events import router as events_router
from app.limiter import limiter

load_dotenv()

cors_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app = FastAPI(
    title="Real-Time Event Dashboard API",
)

app.state.limiter = limiter


app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins if origin.strip()],
    allow_credentials=True,
)

app.include_router(events_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
