import { useEffect, useState } from "react";
import api from "../api";

const blank = {
  username: "",
  studentName: "",
  prn: "",
  branch: "Computer Engineering",
  semester: 1,
  subject1: "Data Structures",
  mse1: 0,
  ese1: 0,
  subject2: "Database Management",
  mse2: 0,
  ese2: 0,
  subject3: "Web Technology",
  mse3: 0,
  ese3: 0,
  subject4: "Software Engineering",
  mse4: 0,
  ese4: 0
};

export default function Admin({ user, onLogout }) {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    api.get("/results")
      .then((res) => setResults(res.data))
      .catch((err) => setError(err.response?.data || "Could not load results."));
  };

  useEffect(() => {
    if (user?.role === "ADMIN") load();
  }, [user]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...form,
      semester: Number(form.semester),
      mse1: Number(form.mse1), ese1: Number(form.ese1),
      mse2: Number(form.mse2), ese2: Number(form.ese2),
      mse3: Number(form.mse3), ese3: Number(form.ese3),
      mse4: Number(form.mse4), ese4: Number(form.ese4)
    };

    try {
      await api.post("/results", payload);
      setMessage("Result saved successfully.");
      setForm(blank);
      load();
    } catch (err) {
      setError(err.response?.data || "Could not save result.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await api.delete(`/results/${id}`);
      load();
    } catch {
      setError("Could not delete result.");
    }
  };

  if (user?.role !== "ADMIN") {
    return <div className="loading">Access denied.</div>;
  }

  return (
    <div className="app-page">
      <header className="topbar">
        <div><div className="brand small">VIT</div><span>Admin Panel</span></div>
        <button className="secondary" onClick={onLogout}>Logout</button>
      </header>

      <main className="container">
        <h1>Prepare Semester Result</h1>
        <p className="muted">Enter four subjects. MSE must be out of 30 and ESE out of 70.</p>

        <form className="admin-form" onSubmit={submit}>
          <div className="grid two">
            <div>
              <label>Student Username</label>
              <input value={form.username} onChange={(e) => update("username", e.target.value)} required />
            </div>
            <div>
              <label>Student Name</label>
              <input value={form.studentName} onChange={(e) => update("studentName", e.target.value)} required />
            </div>
            <div>
              <label>PRN</label>
              <input value={form.prn} onChange={(e) => update("prn", e.target.value)} required />
            </div>
            <div>
              <label>Branch</label>
              <input value={form.branch} onChange={(e) => update("branch", e.target.value)} required />
            </div>
            <div>
              <label>Semester</label>
              <input type="number" min="1" max="8" value={form.semester} onChange={(e) => update("semester", e.target.value)} required />
            </div>
          </div>

          <div className="subject-grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="subject-card" key={i}>
                <h3>Subject {i}</h3>
                <label>Subject Name</label>
                <input value={form[`subject${i}`]} onChange={(e) => update(`subject${i}`, e.target.value)} required />
                <label>MSE / 30</label>
                <input type="number" min="0" max="30" step="0.5" value={form[`mse${i}`]} onChange={(e) => update(`mse${i}`, e.target.value)} required />
                <label>ESE / 70</label>
                <input type="number" min="0" max="70" step="0.5" value={form[`ese${i}`]} onChange={(e) => update(`ese${i}`, e.target.value)} required />
              </div>
            ))}
          </div>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
          <button className="primary">Save Result</button>
        </form>

        <h2 className="section-title">Saved Results</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Username</th><th>Name</th><th>PRN</th><th>Semester</th><th>Action</th></tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.username}</td>
                  <td>{r.studentName}</td>
                  <td>{r.prn}</td>
                  <td>{r.semester}</td>
                  <td><button className="danger" onClick={() => remove(r.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
