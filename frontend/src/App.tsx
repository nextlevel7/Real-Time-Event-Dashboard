import { useCallback, useEffect, useState } from "react";
import { fetchAnalytics, fetchEvents } from "./api/events";
import { usePolling } from "./hooks/usePolling";
import type { AnalyticsResponse, PaginatedEventsResponse } from "./types/event";

export default function App() {
  const [eventsData, setEventsData] = useState<PaginatedEventsResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [eventsRes, analyticsRes] = await Promise.all([
        fetchEvents({ page: 1, limit: 10 }),
        fetchAnalytics(),
      ]);
      setEventsData(eventsRes);
      setAnalytics(analyticsRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  usePolling(loadData, 5000);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold">Real-Time Event Dashboard</h1>
          <span className="text-sm text-slate-500">Polling every 5s</span>
        </header>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-sm text-slate-500">Total Stored Events</p>
            <p className="mt-1 text-2xl font-semibold">{eventsData?.total ?? "—"}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-sm text-slate-500">Events (Last 24h)</p>
            <p className="mt-1 text-2xl font-semibold">{analytics?.total_events ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
