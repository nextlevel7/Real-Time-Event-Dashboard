from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.events import router as events_router
from app.core.config import CORS_ORIGINS
from app.core.limiter import setup_rate_limiter

app = FastAPI(
    title="Real-Time Event Dashboard API",
)

setup_rate_limiter(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
