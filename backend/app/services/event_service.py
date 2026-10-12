import math
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import String, cast, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.event import Event
from app.schemas.event import EventCreate


def create_event(db: Session, event_in: EventCreate) -> Event:
    event = Event(**event_in.model_dump())
    db.add(event)
    try:
        db.commit()
        db.refresh(event)
        return event
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Event with id '{event_in.id}' already exists",
        ) from exc


def list_events(
    db: Session,
    page: int = 1,
    limit: int = 20,
    event_type: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    search: str | None = None,
) -> dict:
    query = select(Event)

    if event_type:
        query = query.where(Event.event_type == event_type)
    if start_date:
        query = query.where(Event.timestamp >= start_date)
    if end_date:
        query = query.where(Event.timestamp <= end_date)
    if search:
        query = query.where(cast(Event.payload, String).ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    offset = (page - 1) * limit
    items = db.scalars(query.order_by(Event.timestamp.desc()).offset(offset).limit(limit)).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": math.ceil(total / limit) if total else 0,
    }


def get_event_analytics(db: Session, window_hours: int = 24) -> dict:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=window_hours)

    rows = db.execute(
        select(Event.event_type, func.count(Event.id).label("count"))
        .where(Event.timestamp >= cutoff)
        .group_by(Event.event_type)
        .order_by(func.count(Event.id).desc())
    ).all()

    data = [{"event_type": row.event_type, "count": row.count} for row in rows]

    return {
        "window_hours": window_hours,
        "total_events": sum(item["count"] for item in data),
        "data": data,
    }
