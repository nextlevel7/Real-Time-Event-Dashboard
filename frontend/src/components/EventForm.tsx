import { useState } from "react";
import { createEvent } from "../api/events";

interface Props {
  onCreated: () => void;
}

export function EventForm({ onCreated }: Props) {
  const [id, setId] = useState(() => `evt_${Math.floor(Math.random() * 10000)}`);
  const [userId, setUserId] = useState("user_1");
  const [eventType, setEventType] = useState("page_view");
  const [payloadText, setPayloadText] = useState('{"path": "/home"}');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(payloadText);
    } catch {
      setError("Payload must be valid JSON object");
      return;
    }

    setSubmitting(true);
    try {
      await createEvent({
        id,
        user_id: userId,
        event_type: eventType,
        payload: parsedPayload,
        timestamp: new Date().toISOString(),
      });
      setId(`evt_${Math.floor(Math.random() * 10000)}`);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ingest event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-4 space-y-3">
      <h2 className="font-semibold text-sm">Ingest New Event</h2>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Event ID"
          required
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          required
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          placeholder="Event Type"
          required
          className="rounded-md border px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          value={payloadText}
          onChange={(e) => setPayloadText(e.target.value)}
          placeholder='{"key": "value"}'
          required
          className="rounded-md border px-3 py-1.5 font-mono text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Event"}
      </button>
    </form>
  );
}

