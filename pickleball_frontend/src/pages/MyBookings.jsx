import React, { useEffect, useState } from "react";
import { myBookings } from "../services/api";

// PUBLIC_INTERFACE
export default function MyBookings() {
  /** Shows current user's bookings and statuses. */
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await myBookings();
        if (mounted) setItems(data);
      } catch (e) {
        setErr(e.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <main className="container">
      <h1>My Bookings</h1>
      {loading && <p>Loading…</p>}
      {err && <div className="alert alert-error">{err}</div>}
      <div className="grid">
        {items.map((b) => {
          const gs = b.group_size || b.players?.length || 0;
          const status = gs >= 4 ? "confirmed" : gs >= 2 ? "pending" : "invalid";
          return (
            <div className="card booking-card" key={b.id || `${b.court_id}-${b.date}-${b.time}`}>
              <div className={`badge ${status}`}>{status}</div>
              <h3>{b.court_name || `Court ${b.court_id}`}</h3>
              <p className="muted">
                {b.date} @ {b.time} • Group size: {gs}
              </p>
              {b.notes && <p className="notes">{b.notes}</p>}
            </div>
          );
        })}
        {!loading && items.length === 0 && <div className="empty">No bookings yet.</div>}
      </div>
    </main>
  );
}
