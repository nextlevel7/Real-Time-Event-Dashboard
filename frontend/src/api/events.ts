import type {
  AnalyticsResponse,
  EventFiltersState,
  EventItem,
  PaginatedEventsResponse,
} from "../types/event";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function fetchEvents(
  page: number,
  limit: number,
  filters: EventFiltersState
): Promise<PaginatedEventsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (filters.event_type) params.set("event_type", filters.event_type);
  if (filters.search) params.set("search", filters.search);
  if (filters.start_date) params.set("start_date", `${filters.start_date}:00Z`);
  if (filters.end_date) params.set("end_date", `${filters.end_date}:59Z`);

  const res = await fetch(`${API_URL}/api/events?${params}`);
  if (!res.ok) throw new Error(`Failed to load events (${res.status})`);
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch(`${API_URL}/api/events/analytics`);
  if (!res.ok) throw new Error(`Failed to load analytics (${res.status})`);
  return res.json();
}

export async function createEvent(event: EventItem): Promise<EventItem> {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to create event (${res.status})`);
  }
  return res.json();
}
