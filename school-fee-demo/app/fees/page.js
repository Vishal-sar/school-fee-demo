"use client";
import { useStore } from "../../components/Providers";
import { CLASSES, inr, monthsElapsed } from "../../lib/utils";

export default function Fees() {
  const { state, ledger, setFee } = useStore();
  const months = monthsElapsed();

  return (
    <>
      <h1>Fee Structure</h1>
      <p className="sub">Har class ki monthly fee. Badalte hi dashboard aur dues update ho jate hain.</p>
      <div className="card tablewrap" style={{ padding: 0, maxWidth: 720 }}>
        <table>
          <thead>
            <tr><th>Class</th><th>Students</th><th>Monthly fee (₹)</th><th className="num">Due till now</th><th className="num">Yearly</th></tr>
          </thead>
          <tbody>
            {CLASSES.map((c) => (
              <tr key={c}>
                <td>{c}</td>
                <td>{ledger.filter((s) => s.cls === c).length}</td>
                <td><input type="number" min="0" value={state.fees[c]} onChange={(e) => setFee(c, e.target.value)} style={{ width: 110 }} /></td>
                <td className="num">{inr(state.fees[c] * months)}</td>
                <td className="num">{inr(state.fees[c] * 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
