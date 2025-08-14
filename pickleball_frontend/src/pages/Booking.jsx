import React, { useEffect, useMemo, useState } from "react";
import { createBooking, listCourts } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Booking() {
  /** Booking UI to pick court, date/time, and group size with rule hints. */
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    court_id: "",
    date: "",
    time: "",
    group_size: 2,
    notes: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await listCourts();
        if (mounted) {
          setCourts(items);
          if (items.length > 0) setForm((f) => ({ ...f, court_id: items[0].id || items[0].uuid || items[0].name }));
        }
      } catch (e) {
        setErr(e.message || "Failed to load courts");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "group_size" ? Number(value) : value }));
  };

  const statusText = useMemo(() => {
    if (form.group_size < 2) return "Group too small. Minimum 2 players to start.";
    if (form.group_size < 4) return "Reservation pending. Invite more friends!";
    return "Reservation confirmed with 4 players!";
    // Business rule: min 2 to start, confirmed at 4.
  }, [form.group_size]);

  const canSubmit =
    form.court_id && form.date && form.time && form.group_size >= 2 && form.group_size <= 4;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!canSubmit) return;
    setSubmitting(true);
    setErr("");
    try {
      const result = await createBooking(form);
      navigate("/my-bookings", { state: { created: result } });
    } catch (e) {
      setErr(e.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container narrow">
      <h1>Book a Court</h1>
      <form className="card" onSubmit={onSubmit}>
        {loading && <p>Loading courts…</p>}
        {err && <div className="alert alert-error">{err}</div>}
        <label>
          Court
          <select name="court_id" value={form.court_id} onChange={onChange} required>
            {courts.map((c) => (
              <option value={c.id || c.uuid || c.name} key={c.id || c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <label>
            Date
            <input type="date" name="date" value={form.date} onChange={onChange} required />
          </label>
          <label>
            Time
            <input type="time" name="time" value={form.time} onChange={onChange} required />
          </label>
        </div>
        <label>
          Group size (2–4)
          <input
            type="number"
            name="group_size"
            min={2}
            max={4}
            value={form.group_size}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Notes (optional)
          <input
            type="text"
            name="notes"
            placeholder="Team name, preferences, etc."
            value={form.notes}
            onChange={onChange}
          />
        </label>
        <div className={`booking-status ${form.group_size === 4 ? "ok" : "pending"}`}>
          {statusText}
        </div>
        <button className="btn btn-primary" type="submit" disabled={!canSubmit || submitting}>
          {submitting ? "Booking..." : "Reserve"}
        </button>
        <p className="muted">
          Want to check your reservations? <Link to="/my-bookings">See My Bookings</Link>
        </p>
      </form>
    </main>
  );
}
