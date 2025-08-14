import React, { useEffect, useState } from "react";
import { listCourts } from "../services/api";

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const items = await listCourts();
        if (mounted) setCourts(items);
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

  return (
    <main className="container">
      <h1>Courts</h1>
      {loading && <p>Loading courts…</p>}
      {err && <div className="alert alert-error">{err}</div>}
      <div className="grid">
        {courts.map((c) => (
          <div className="card court-card" key={c.id || c.name}>
            <div className="badge">{c.status || "available"}</div>
            <h3>{c.name}</h3>
            <p className="muted">
              {c.location ? `${c.location} • ` : ""}Surface: {c.surface || "hard"}
            </p>
          </div>
        ))}
        {!loading && courts.length === 0 && (
          <div className="empty">No courts yet. Check back soon!</div>
        )}
      </div>
    </main>
  );
};

export default Courts;
