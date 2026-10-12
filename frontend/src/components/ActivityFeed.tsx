import type { EventItem } from "../types/event";
import { formatTimestamp } from "../utils/formatters";

interface Props {
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ActivityFeed({ events, isLoading, error, onRetry }: Props) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-xs text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && events.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-500">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-500">
        No events found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Payload</th>
            <th className="px-4 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs">{event.id}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {event.event_type}
                </span>
              </td>
              <td className="px-4 py-3">{event.user_id}</td>
              <td className="px-4 py-3 font-mono text-xs">
                {JSON.stringify(event.payload)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                {formatTimestamp(event.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
