import { useEffect, useMemo, useState } from "react";
import api from "../api";

function calculate(mse, ese) {
  const internal = Number(mse || 0);
  const external = Number(ese || 0);
  const total = internal + external;
  let grade = "F";

  if (total >= 90) grade = "O";
  else if (total >= 80) grade = "A+";
  else if (total >= 70) grade = "A";
  else if (total >= 60) grade = "B+";
  else if (total >= 50) grade = "B";
  else if (total >= 40) grade = "C";

  return { total, grade };
}

export default function Dashboard({ user, onLogout }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/results/me")
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.response?.data || "No result found."))
      .finally(() => setLoading(false));
  }, []);

  const subjects = useMemo(() => {
    if (!result) return [];
    return [1, 2, 3, 4].map((i) => ({
      name: result[`subject${i}`],
      mse: result[`mse${i}`],
      ese: result[`ese${i}`]
    }));
  }, [result]);

  const totals = subjects.map((s) => calculate(s.mse, s.ese));
  const grandTotal = totals.reduce((sum, x) => sum + x.total, 0);
  const percentage = totals.length ? (grandTotal / 400) * 100 : 0;
  const passed = totals.length === 4 && totals.every((x) => x.total >= 40);

  if (loading) return <div className="loading">Loading result...</div>;

  return (
    <div className="app-page">
      <header className="topbar">
        <div>
          <div className="brand small">VIT</div>
          <span>Semester Result Portal</span>
        </div>
        <div className="top-actions">
          <span className="user-chip">{user?.username}</span>
          {user?.role === "ADMIN" && (
            <a className="admin-link" href="/admin">Admin</a>
          )}
          <button className="secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">ONE SEMESTER RESULT</p>
            <h1>{result ? result.studentName : "Student"}</h1>
            <p className="muted">
              {result?.prn} · {result?.branch} · Semester {result?.semester}
            </p>
          </div>
          <div className={`status ${passed ? "pass" : "fail"}`}>
            {passed ? "PASS" : "RESULT"}
          </div>
        </section>

        {error && <div className="error">{error}</div>}

        {result ? (
          <>
            <div className="stats">
              <div><span>Grand Total</span><b>{grandTotal.toFixed(1)} / 400</b></div>
              <div><span>Percentage</span><b>{percentage.toFixed(2)}%</b></div>
              <div><span>Status</span><b>{passed ? "PASS" : "FAIL"}</b></div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>MSE (30%)</th>
                    <th>ESE (70%)</th>
                    <th>Total / 100</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s, index) => {
                    const item = calculate(s.mse, s.ese);
                    return (
                      <tr key={index}>
                        <td>{s.name}</td>
                        <td>{s.mse}</td>
                        <td>{s.ese}</td>
                        <td>{item.total.toFixed(1)}</td>
                        <td><span className="grade">{item.grade}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="formula">
              <b>Calculation:</b> MSE is entered out of 30 and ESE is entered out of 70.
              Final subject marks = MSE + ESE.
            </div>

            <button className="primary print" onClick={() => window.print()}>
              Print / Save Result
            </button>
          </>
        ) : (
          <div className="empty">Ask the administrator to add your semester result.</div>
        )}
      </main>
    </div>
  );
}
