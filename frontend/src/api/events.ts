import type {
  AnalyticsResponse,
  EventFilterParams,
  PaginatedEventsResponse,
} from "../types/event";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function fetchEvents(
  params: EventFilterParams,
  signal?: AbortSignal
): Promise<PaginatedEventsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.event_type) searchParams.set("event_type", params.event_type);
  if (params.start_date) searchParams.set("start_date", params.start_date);
  if (params.end_date) searchParams.set("end_date", params.end_date);
  if (params.search) searchParams.set("search", params.search);

  const response = await fetch(`${API_BASE_URL}/api/events?${searchParams.toString()}`, {
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Failed to fetch events (${response.status})`);
  }

  return response.json();
}

export async function fetchAnalytics(signal?: AbortSignal): Promise<AnalyticsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/events/analytics`, { signal });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Failed to fetch analytics (${response.status})`);
  }

  return response.json();
}

