export const CLASSES = ["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const SCHOOL = {
  name: "Demo Public School",
  address: "Aligarh, Uttar Pradesh",
};

// Session runs April -> March
export function sessionStartYear(now = new Date()) {
  return now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear();
}

export function sessionLabel(now = new Date()) {
  const y = sessionStartYear(now);
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

// How many monthly fees are due so far in this session (April = 1 ... March = 12)
export function monthsElapsed(now = new Date()) {
  return ((now.getMonth() - 3 + 12) % 12) + 1;
}

export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function buildLedger(state) {
  const months = monthsElapsed();
  const paidBy = {};
  for (const p of state.payments) paidBy[p.studentId] = (paidBy[p.studentId] || 0) + p.amount;
  return state.students.map((s) => {
    const expected = months * (state.fees[s.cls] || 0);
    const paid = paidBy[s.id] || 0;
    const pending = Math.max(expected - paid, 0);
    const status = pending === 0 ? "Paid" : paid === 0 ? "Unpaid" : "Partial";
    return { ...s, expected, paid, pending, status };
  });
}
