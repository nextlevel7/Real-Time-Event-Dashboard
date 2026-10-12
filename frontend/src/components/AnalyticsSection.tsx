import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsResponse } from "../types/event";

interface Props {
  analytics: AnalyticsResponse | null;
  totalMatching: number;
}

export function AnalyticsSection({ analytics, totalMatching }: Props) {
  const data = analytics?.data ?? [];

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-slate-500">Events (Last 24h)</p>
          <p className="text-2xl font-bold">{analytics?.total_events ?? 0}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-slate-500">Event Types (24h)</p>
          <p className="text-2xl font-bold">{data.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-slate-500">Matching Events</p>
          <p className="text-2xl font-bold">{totalMatching}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Events by Type (Last 24h)</h2>
        {data.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            No events in the last 24 hours.
          </p>
        ) : (
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event_type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
