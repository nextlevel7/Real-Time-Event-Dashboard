from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EventCreate(BaseModel):
    id: str = Field(..., min_length=1, max_length=128)
    user_id: str = Field(..., min_length=1, max_length=128)
    event_type: str = Field(..., min_length=1, max_length=64)
    payload: dict[str, Any]
    timestamp: datetime

    @field_validator("id", "user_id", "event_type")
    @classmethod
    def validate_not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value

    @field_validator("timestamp")
    @classmethod
    def to_utc(cls, value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)


class EventResponse(BaseModel):
    id: str
    user_id: str
    event_type: str
    payload: dict[str, Any]
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedEventsResponse(BaseModel):
    items: list[EventResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class EventTypeCount(BaseModel):
    event_type: str
    count: int


class AnalyticsResponse(BaseModel):
    window_hours: int = 24
    total_events: int
    data: list[EventTypeCount]
