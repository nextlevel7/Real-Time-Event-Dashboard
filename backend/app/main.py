from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI(
    title="Real-Time Event Dashboard API",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
