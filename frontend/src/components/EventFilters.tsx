import type { EventFiltersState } from "../types/event";

interface Props {
  filters: EventFiltersState;
  onChange: (updated: EventFiltersState) => void;
  onReset: () => void;
}

export function EventFilters({ filters, onChange, onReset }: Props) {
  const update = (field: keyof EventFiltersState, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Search payload..."
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          value={filters.event_type}
          onChange={(e) => update("event_type", e.target.value)}
          placeholder="Filter by event_type..."
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="datetime-local"
          value={filters.start_date}
          onChange={(e) => update("start_date", e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="datetime-local"
          value={filters.end_date}
          onChange={(e) => update("end_date", e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={onReset}
          className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium hover:bg-slate-200"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
