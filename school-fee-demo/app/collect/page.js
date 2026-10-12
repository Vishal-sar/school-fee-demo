"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../../components/Providers";
import { inr } from "../../lib/utils";

function CollectForm() {
  const { ledger, addPayment } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [selId, setSelId] = useState(params.get("student") || "");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");
  const [note, setNote] = useState("");

  const sel = ledger.find((s) => s.id === selId);
  useEffect(() => {
    if (sel) setAmount(String(sel.pending || ""));
  }, [selId]); // eslint-disable-line

  const t = q.trim().toLowerCase();
  const matches = t
    ? ledger.filter((s) => s.name.toLowerCase().includes(t) || s.id.toLowerCase().includes(t) || s.parent.toLowerCase().includes(t)).slice(0, 8)
    : [];

  function submit(e) {
    e.preventDefault();
    const amt = Number(amount);
    if (!sel || !amt || amt <= 0) return;
    const id = addPayment({ studentId: sel.id, amount: amt, mode, note });
    router.push(`/receipt/${id}`);
  }

  return (
    <>
      <h1>Collect Fee</h1>
      <p className="sub">Student chuno, amount daalo, receipt turant ban jayegi.</p>

      <div className="card" style={{ maxWidth: 640 }}>
        {!sel ? (
          <>
            <div className="field">
              <label>Student search (naam / ID / parent)</label>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Aarav ya S0012" />
            </div>
            {matches.length > 0 && (
              <div className="pick">
                {matches.map((s) => (
                  <button key={s.id} type="button" onClick={() => setSelId(s.id)}>
                    {s.name} · Class {s.cls} · {s.id} <span style={{ color: "var(--muted)" }}>(Pending {inr(s.pending)})</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={submit} className="grid">
            <div>
              <strong>{sel.name}</strong> · Class {sel.cls} · {sel.id}
              <div style={{ color: "var(--muted)" }}>Parent: {sel.parent}</div>
              <div style={{ marginTop: 6 }}>Due {inr(sel.expected)} · Paid {inr(sel.paid)} · <strong style={{ color: "var(--bad)" }}>Pending {inr(sel.pending)}</strong></div>
              <button type="button" className="outline" style={{ marginTop: 8 }} onClick={() => { setSelId(""); setAmount(""); }}>Student badlo</button>
            </div>
            <div className="form">
              <div className="field"><label>Amount (₹)</label><input type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
              <div className="field"><label>Payment mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option>Cash</option><option>UPI</option><option>Cheque</option><option>Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="field"><label>Note (optional)</label><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Oct fee, transport" /></div>
            <div><button type="submit">Receipt banao</button></div>
          </form>
        )}
      </div>
    </>
  );
}

export default function Collect() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <CollectForm />
    </Suspense>
  );
}
