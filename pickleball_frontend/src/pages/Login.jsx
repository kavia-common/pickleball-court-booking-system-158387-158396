import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Login() {
  /** Login UI allowing to choose user or admin role. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(form.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <h1>Login</h1>
      <form className="card" onSubmit={onSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={onChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="muted">
          No account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}
