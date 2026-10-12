"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "../../components/Providers";
import { CLASSES, inr } from "../../lib/utils";

export default function Defaulters() {
  const { ledger } = useStore();
  const [cls, setCls] = useState("");
  const [min, setMin] = useState("0");

  const rows = ledger
    .filter((s) => s.pending > 0 && (!cls || s.cls === cls) && s.pending >= Number(min || 0))
    .sort((a, b) => b.pending - a.pending);
  const total = rows.reduce((a, s) => a + s.pending, 0);

  function exportCsv() {
    const head = ["ID", "Name", "Class", "Parent", "Phone", "Due", "Paid", "Pending"];
    const body = rows.map((s) => [s.id, s.name, s.cls, s.parent, s.phone, s.expected, s.paid, s.pending]);
    const csv = [head, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "defaulters.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1>Defaulters</h1>
      <p className="sub">{rows.length} students · kul pending {inr(total)}</p>
      <div className="toolbar">
        <select value={cls} onChange={(e) => setCls(e.target.value)}>
          <option value="">Sab classes</option>
          {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select value={min} onChange={(e) => setMin(e.target.value)}>
          <option value="0">Koi bhi pending</option>
          <option value="2000">₹2,000 se upar</option>
          <option value="5000">₹5,000 se upar</option>
          <option value="10000">₹10,000 se upar</option>
        </select>
        <button className="outline" onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="card tablewrap" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>Name</th><th>Class</th><th>Parent</th><th>Phone</th><th className="num">Pending</th><th></th></tr></thead>
          <tbody>
            {rows.slice(0, 100).map((s) => (
              <tr key={s.id}>
                <td>{s.name}<div style={{ color: "var(--muted)", fontSize: 12 }}>{s.id}</div></td>
                <td>{s.cls}</td>
                <td>{s.parent}</td>
                <td>{s.phone}</td>
                <td className="num" style={{ color: "var(--bad)", fontWeight: 700 }}>{inr(s.pending)}</td>
                <td><Link href={`/collect?student=${s.id}`}>Collect</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 100 && <p className="sub" style={{ marginTop: 10 }}>Top 100 dikh rahe hain. Poori list ke liye CSV export karo.</p>}
    </>
  );
}
