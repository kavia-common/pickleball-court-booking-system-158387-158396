import React, { useEffect, useState } from "react";
import { createCourt, listAllBookings, listCourts } from "../services/api";

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Admin dashboard to create courts and list all bookings. */
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", location: "", surface: "hard" });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setErr("");
    try {
      const [c, b] = await Promise.all([listCourts(), listAllBookings()]);
      setCourts(c);
      setBookings(b);
    } catch (e) {
      setErr(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadData();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitCourt = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createCourt(form);
      setForm({ name: "", location: "", surface: "hard" });
      await loadData();
    } catch (e) {
      setErr(e.message || "Failed to create court");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      {err && <div className="alert alert-error">{err}</div>}
      {loading && <p>Loading…</p>}

      <section className="card">
        <h2>Create Court</h2>
        <form className="row" onSubmit={submitCourt}>
          <input
            name="name"
            placeholder="Court name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            name="location"
            placeholder="Location (optional)"
            value={form.location}
            onChange={onChange}
          />
          <select name="surface" value={form.surface} onChange={onChange}>
            <option value="hard">Hard</option>
            <option value="clay">Clay</option>
            <option value="grass">Grass</option>
          </select>
          <button className="btn btn-accent" type="submit" disabled={creating}>
            {creating ? "Creating…" : "Add Court"}
          </button>
        </form>
      </section>

      <section className="grid two-col">
        <div className="card">
          <h2>Courts</h2>
          {courts.length === 0 ? (
            <p className="muted">No courts created yet.</p>
          ) : (
            <ul className="list">
              {courts.map((c) => (
                <li key={c.id || c.name}>
                  <strong>{c.name}</strong> — {c.location || "Unknown"} • {c.surface || "hard"}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p className="muted">No bookings found.</p>
          ) : (
            <ul className="list">
              {bookings.map((b) => {
                const gs = b.group_size || b.players?.length || 0;
                const status = gs >= 4 ? "confirmed" : gs >= 2 ? "pending" : "invalid";
                return (
                  <li key={b.id || `${b.court_id}-${b.date}-${b.time}`}>
                    <span className={`badge ${status}`}>{status}</span>{" "}
                    <strong>{b.court_name || `Court ${b.court_id}`}</strong> — {b.date} @ {b.time} • group {gs}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
