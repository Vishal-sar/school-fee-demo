"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "../../components/Providers";
import { CLASSES, inr } from "../../lib/utils";

const PAGE = 25;

export default function Students() {
  const { ledger, addStudent } = useStore();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", cls: "1", parent: "", phone: "" });

  const rows = ledger.filter((s) => {
    const t = q.trim().toLowerCase();
    return (
      (!t || s.name.toLowerCase().includes(t) || s.id.toLowerCase().includes(t) || s.parent.toLowerCase().includes(t)) &&
      (!cls || s.cls === cls) &&
      (!status || s.status === status)
    );
  });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = rows.slice(page * PAGE, page * PAGE + PAGE);

  const reset = (fn) => (e) => { fn(e.target.value); setPage(0); };

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addStudent({ ...form, name: form.name.trim(), parent: form.parent.trim() });
    setForm({ name: "", cls: "1", parent: "", phone: "" });
    setAdding(false);
  }

  return (
    <>
      <h1>Students</h1>
      <p className="sub">{rows.length} students</p>

      <div className="toolbar">
        <input placeholder="Naam / ID / parent search" value={q} onChange={reset(setQ)} style={{ minWidth: 240 }} />
        <select value={cls} onChange={reset(setCls)}>
          <option value="">Sab classes</option>
          {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select value={status} onChange={reset(setStatus)}>
          <option value="">Sab status</option>
          <option>Paid</option><option>Partial</option><option>Unpaid</option>
        </select>
        <button onClick={() => setAdding(!adding)}>{adding ? "Cancel" : "+ Add student"}</button>
      </div>

      {adding && (
        <form className="card form" onSubmit={submit} style={{ marginBottom: 14 }}>
          <div className="field"><label>Student ka naam</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Class</label>
            <select value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>Parent ka naam</label><input value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} /></div>
          <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field" style={{ alignSelf: "end" }}><button type="submit">Save student</button></div>
        </form>
      )}

      <div className="card tablewrap" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Class</th><th>Parent</th><th className="num">Due</th><th className="num">Paid</th><th className="num">Pending</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {view.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.cls}</td>
                <td>{s.parent}</td>
                <td className="num">{inr(s.expected)}</td>
                <td className="num">{inr(s.paid)}</td>
                <td className="num">{inr(s.pending)}</td>
                <td><span className={`badge ${s.status}`}>{s.status}</span></td>
                <td>{s.pending > 0 && <Link href={`/collect?student=${s.id}`}>Collect</Link>}</td>
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan={9} style={{ color: "var(--muted)" }}>Koi student nahi mila.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <button className="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page + 1} / {pages}</span>
        <button className="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </>
  );
}
