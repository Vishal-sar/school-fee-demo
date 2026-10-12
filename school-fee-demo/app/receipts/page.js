"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "../../components/Providers";
import { fmtDate, inr } from "../../lib/utils";

export default function Receipts() {
  const { state, ledger } = useStore();
  const [q, setQ] = useState("");
  const byId = Object.fromEntries(ledger.map((s) => [s.id, s]));
  const t = q.trim().toLowerCase();
  const rows = [...state.payments]
    .reverse()
    .filter((p) => !t || p.id.toLowerCase().includes(t) || byId[p.studentId]?.name.toLowerCase().includes(t))
    .slice(0, 100);

  return (
    <>
      <h1>Receipts</h1>
      <p className="sub">Latest 100 receipts</p>
      <div className="toolbar">
        <input placeholder="Receipt no. ya student naam" value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 260 }} />
      </div>
      <div className="card tablewrap" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>Receipt</th><th>Date</th><th>Student</th><th>Class</th><th>Mode</th><th className="num">Amount</th></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td><Link href={`/receipt/${p.id}`}>{p.id}</Link></td>
                <td>{fmtDate(p.date)}</td>
                <td>{byId[p.studentId]?.name}</td>
                <td>{byId[p.studentId]?.cls}</td>
                <td>{p.mode}</td>
                <td className="num">{inr(p.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
