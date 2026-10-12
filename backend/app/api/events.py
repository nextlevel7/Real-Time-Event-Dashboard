from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.limiter import RATE_LIMIT_DEFAULT, limiter
from app.schemas.event import (
    AnalyticsResponse,
    EventCreate,
    EventResponse,
    PaginatedEventsResponse,
)
from app.services.event_service import (
    create_event,
    get_event_analytics,
    list_events,
)

router = APIRouter(prefix="/api/events", tags=["events"])


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit(RATE_LIMIT_DEFAULT)
def ingest_event(
    request: Request,
    event_in: EventCreate,
    db: Session = Depends(get_db),
):
    return create_event(db, event_in)


@router.get("", response_model=PaginatedEventsResponse)
@limiter.limit(RATE_LIMIT_DEFAULT)
def get_events(
    request: Request,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    event_type: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be earlier than or equal to end_date",
        )
    return list_events(db, page, limit, event_type, start_date, end_date, search)


@router.get("/analytics", response_model=AnalyticsResponse)
@limiter.limit(RATE_LIMIT_DEFAULT)
def get_analytics(
    request: Request,
    db: Session = Depends(get_db),
):
    return get_event_analytics(db)
