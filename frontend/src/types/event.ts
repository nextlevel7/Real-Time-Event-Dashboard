export interface EventItem {
  id: string;
  user_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedEventsResponse {
  items: EventItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface EventTypeCount {
  event_type: string;
  count: number;
}

export interface AnalyticsResponse {
  window_hours: number;
  total_events: number;
  data: EventTypeCount[];
}

export interface EventFilterParams {
  page?: number;
  limit?: number;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

