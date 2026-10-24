import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/auth/register", form);
      setMessage("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.response?.data || "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">VIT</div>
        <h1>Create Student Account</h1>
        <p className="muted">Use a unique username and a secure password.</p>

        <form onSubmit={submit}>
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="e.g. rugved01"
            minLength="3"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 6 characters"
            minLength="6"
            required
          />

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}
          <button className="primary full">Register</button>
        </form>

        <p className="center">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
