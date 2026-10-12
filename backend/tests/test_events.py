from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


def test_create_and_duplicate_event():
    payload = {
        "id": "evt_1",
        "user_id": "user_1",
        "event_type": "signup",
        "payload": {"plan": "pro"},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    res1 = client.post("/api/events", json=payload)
    assert res1.status_code == 201
    assert res1.json()["id"] == "evt_1"

    res2 = client.post("/api/events", json=payload)
    assert res2.status_code == 409


def test_create_event_validation_error():
    res = client.post(
        "/api/events",
        json={
            "id": "   ",
            "user_id": "user_1",
            "event_type": "click",
            "payload": {"btn": "save"},
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )
    assert res.status_code == 422


def test_list_events_and_filters():
    now = datetime.now(timezone.utc).isoformat()
    client.post(
        "/api/events",
        json={
            "id": "evt_a",
            "user_id": "u1",
            "event_type": "page_view",
            "payload": {"browser": "firefox"},
            "timestamp": now,
        },
    )
    client.post(
        "/api/events",
        json={
            "id": "evt_b",
            "user_id": "u2",
            "event_type": "purchase",
            "payload": {"item": "keyboard"},
            "timestamp": now,
        },
    )

    by_type = client.get("/api/events?event_type=page_view").json()
    assert by_type["total"] == 1
    assert by_type["items"][0]["id"] == "evt_a"

    by_search = client.get("/api/events?search=keyboard").json()
    assert by_search["total"] == 1
    assert by_search["items"][0]["id"] == "evt_b"


def test_analytics_last_24h():
    now = datetime.now(timezone.utc)
    old = now - timedelta(hours=48)

    client.post(
        "/api/events",
        json={
            "id": "recent_1",
            "user_id": "u1",
            "event_type": "login",
            "payload": {},
            "timestamp": now.isoformat(),
        },
    )
    client.post(
        "/api/events",
        json={
            "id": "old_1",
            "user_id": "u1",
            "event_type": "login",
            "payload": {},
            "timestamp": old.isoformat(),
        },
    )

    res = client.get("/api/events/analytics")
    assert res.status_code == 200
    body = res.json()
    assert body["total_events"] == 1
    assert body["data"] == [{"event_type": "login", "count": 1}]
