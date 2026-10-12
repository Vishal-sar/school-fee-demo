"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildSeed } from "../lib/seed";
import { buildLedger, SCHOOL, sessionLabel } from "../lib/utils";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const KEY = "school-fee-demo-v1";

const NAV = [
  ["/", "Dashboard"],
  ["/students", "Students"],
  ["/collect", "Collect Fee"],
  ["/receipts", "Receipts"],
  ["/defaulters", "Defaulters"],
  ["/fees", "Fee Structure"],
];

export default function Providers({ children }) {
  const [state, setState] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setState(raw ? JSON.parse(raw) : buildSeed());
    } catch {
      setState(buildSeed());
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const ledger = useMemo(() => (state ? buildLedger(state) : []), [state]);

  const actions = state && {
    addStudent(s) {
      const id = "S" + String(state.students.length + 1).padStart(4, "0");
      const roll = state.students.filter((x) => x.cls === s.cls).length + 1;
      setState({ ...state, students: [...state.students, { ...s, id, roll }] });
      return id;
    },
    addPayment(p) {
      const no = state.nextReceipt;
      const pay = { ...p, id: "R-" + String(no).padStart(4, "0"), date: new Date().toISOString() };
      setState({ ...state, payments: [...state.payments, pay], nextReceipt: no + 1 });
      return pay.id;
    },
    setFee(cls, value) {
      setState({ ...state, fees: { ...state.fees, [cls]: Math.max(0, Number(value) || 0) } });
    },
    reset() {
      setState(buildSeed());
    },
  };

  return (
    <div className="shell">
      <aside className="nav">
        <div className="brand">
          <div className="brand-name">{SCHOOL.name}</div>
          <div className="brand-sub">Fee Management · {sessionLabel()}</div>
        </div>
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            {label}
          </Link>
        ))}
        <div className="spacer" />
        {actions && (
          <button
            className="ghost"
            onClick={() => {
              if (confirm("Demo data reset karna hai? Aapke add kiye hue students/payments hat jayenge.")) actions.reset();
            }}
          >
            Reset demo data
          </button>
        )}
        <div className="demo-note">Demo version: data sirf is browser me save hota hai.</div>
      </aside>
      <main className="main">
        {state ? <Ctx.Provider value={{ state, ledger, ...actions }}>{children}</Ctx.Provider> : <p>Loading…</p>}
      </main>
    </div>
  );
}
