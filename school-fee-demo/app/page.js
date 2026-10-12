"use client";
import Link from "next/link";
import { useStore } from "../components/Providers";
import { CLASSES, inr, fmtDate, monthsElapsed } from "../lib/utils";

export default function Dashboard() {
  const { state, ledger } = useStore();
  const expected = ledger.reduce((a, s) => a + s.expected, 0);
  const paid = ledger.reduce((a, s) => a + s.paid, 0);
  const pending = ledger.reduce((a, s) => a + s.pending, 0);
  const defaulters = ledger.filter((s) => s.pending > 0).length;
  const pct = expected ? Math.round((paid / expected) * 100) : 0;
  const today = new Date().toDateString();
  const todayTotal = state.payments
    .filter((p) => new Date(p.date).toDateString() === today)
    .reduce((a, p) => a + p.amount, 0);

  const byClass = CLASSES.map((c) => {
    const rows = ledger.filter((s) => s.cls === c);
    const e = rows.reduce((a, s) => a + s.expected, 0);
    const p = rows.reduce((a, s) => a + s.paid, 0);
    return { cls: c, pct: e ? Math.round((p / e) * 100) : 0, count: rows.length };
  });

  const nameOf = (id) => ledger.find((s) => s.id === id);
  const recent = [...state.payments].reverse().slice(0, 8);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="sub">{monthsElapsed()} mahine ki fee abhi tak due hai (session April se shuru).</p>

      <div className="grid cards">
        <div className="card"><div className="stat-label">Students</div><div className="stat-value">{ledger.length}</div></div>
        <div className="card"><div className="stat-label">Total due (till now)</div><div className="stat-value">{inr(expected)}</div></div>
        <div className="card"><div className="stat-label">Collected</div><div className="stat-value ok">{inr(paid)}</div></div>
        <div className="card"><div className="stat-label">Pending</div><div className="stat-value bad">{inr(pending)}</div></div>
        <div className="card"><div className="stat-label">Collection %</div><div className="stat-value">{pct}%</div></div>
        <div className="card"><div className="stat-label">Defaulters</div><div className="stat-value bad">{defaulters}</div></div>
        <div className="card"><div className="stat-label">Aaj ka collection</div><div className="stat-value">{inr(todayTotal)}</div></div>
      </div>

      <div className="grid two">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Class-wise collection</h3>
          {byClass.map((b) => (
            <div className="row" key={b.cls}>
              <span className="lbl">{b.cls}</span>
              <div className="bar"><i style={{ width: b.pct + "%" }} /></div>
              <span className="pct">{b.pct}%</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Recent receipts</h3>
          <table>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/receipt/${p.id}`}>{p.id}</Link>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{nameOf(p.studentId)?.name} · {fmtDate(p.date)}</div>
                  </td>
                  <td className="num">{inr(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
