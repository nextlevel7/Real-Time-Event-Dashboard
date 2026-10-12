import { useCallback, useEffect, useState } from "react";
import { fetchAnalytics, fetchEvents } from "./api/events";
import { ActivityFeed } from "./components/ActivityFeed";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { EventFilters } from "./components/EventFilters";
import { EventForm } from "./components/EventForm";
import { Pagination } from "./components/Pagination";
import { usePolling } from "./hooks/usePolling";
import type {
  AnalyticsResponse,
  EventFiltersState,
  PaginatedEventsResponse,
} from "./types/event";

const INITIAL_FILTERS: EventFiltersState = {
  event_type: "",
  search: "",
  start_date: "",
  end_date: "",
};

export default function App() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<EventFiltersState>(INITIAL_FILTERS);
  const [eventsData, setEventsData] = useState<PaginatedEventsResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [eventsRes, analyticsRes] = await Promise.all([
        fetchEvents(page, 10, filters),
        fetchAnalytics(),
      ]);
      setEventsData(eventsRes);
      setAnalytics(analyticsRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  usePolling(loadData, 5000);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold">Real-Time Event Dashboard</h1>
          <span className="text-xs text-slate-500">Auto-refreshing every 5s</span>
        </header>

        <EventForm onCreated={loadData} />

        <AnalyticsSection
          analytics={analytics}
          totalMatching={eventsData?.total ?? 0}
        />

        <EventFilters
          filters={filters}
          onChange={(updated) => {
            setFilters(updated);
            setPage(1);
          }}
          onReset={() => {
            setFilters(INITIAL_FILTERS);
            setPage(1);
          }}
        />

        <ActivityFeed
          events={eventsData?.items ?? []}
          isLoading={isLoading}
          error={error}
          onRetry={loadData}
        />

        <Pagination
          page={page}
          totalPages={eventsData?.total_pages ?? 1}
          total={eventsData?.total ?? 0}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
