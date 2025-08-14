import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration UI for users and admins. */
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
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
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container narrow">
      <h1>Create account</h1>
      <form className="card" onSubmit={onSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Name
          <input
            name="name"
            placeholder="Jane Player"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>
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
            placeholder="Create a strong password"
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
        <button className="btn btn-accent" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
