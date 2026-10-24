import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", form);
      onLogin(response.data);
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">VIT</div>
        <h1>Semester Result Portal</h1>
        <p className="muted">Sign in to view your academic result.</p>

        <form onSubmit={submit}>
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Enter username"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter password"
            required
          />

          {error && <div className="error">{error}</div>}
          <button className="primary full">Login</button>
        </form>

        <p className="center">
          New student? <Link to="/register">Create account</Link>
        </p>
        <div className="demo-box">
          <b>Demo:</b> student / student123
        </div>
      </div>
    </div>
  );
}
