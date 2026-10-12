"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "../../../components/Providers";
import { SCHOOL, fmtDate, inr, sessionLabel } from "../../../lib/utils";

export default function Receipt() {
  const { id } = useParams();
  const { state, ledger } = useStore();
  const pay = state.payments.find((p) => p.id === id);
  if (!pay) return <p>Receipt nahi mili. <Link href="/receipts">Receipts par jao</Link></p>;
  const s = ledger.find((x) => x.id === pay.studentId);

  return (
    <>
      <div className="toolbar noprint">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
        <Link href="/collect">Nayi fee collect karo</Link>
      </div>
      <div className="receipt">
        <h2>{SCHOOL.name}</h2>
        <div className="center">{SCHOOL.address}<br />Fee Receipt · Session {sessionLabel()}</div>
        <div className="kv"><span>Receipt No.</span><strong>{pay.id}</strong></div>
        <div className="kv"><span>Date</span><span>{fmtDate(pay.date)}</span></div>
        <div className="kv"><span>Student</span><span>{s?.name} ({s?.id})</span></div>
        <div className="kv"><span>Class</span><span>{s?.cls}</span></div>
        <div className="kv"><span>Parent</span><span>{s?.parent}</span></div>
        <div className="kv"><span>Payment mode</span><span>{pay.mode}</span></div>
        {pay.note && <div className="kv"><span>Note</span><span>{pay.note}</span></div>}
        <div className="amount">Amount received: {inr(pay.amount)}</div>
        <div className="kv"><span>Total due till date</span><span>{inr(s?.expected)}</span></div>
        <div className="kv"><span>Total paid till date</span><span>{inr(s?.paid)}</span></div>
        <div className="kv"><span>Balance pending</span><strong>{inr(s?.pending)}</strong></div>
        <div className="sign"><span>Parent signature</span><span>Authorised signatory</span></div>
      </div>
    </>
  );
}
