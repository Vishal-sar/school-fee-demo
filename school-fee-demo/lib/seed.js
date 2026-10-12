import { CLASSES, monthsElapsed, sessionStartYear } from "./utils";

function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Aarav", "Vivaan", "Aditya", "Arjun", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharv",
  "Ananya", "Diya", "Saanvi", "Aadhya", "Myra", "Anika", "Kiara", "Riya", "Pari", "Navya",
  "Zaid", "Fatima", "Aisha", "Rehan", "Arman", "Sana", "Zoya", "Kabir", "Rudra", "Tanvi"];
const LAST = ["Sharma", "Verma", "Gupta", "Singh", "Khan", "Ansari", "Yadav", "Agarwal", "Chaudhary", "Mishra",
  "Saxena", "Rathore", "Siddiqui", "Pathan", "Jain"];
const PARENT = ["Rajesh", "Sunil", "Anil", "Mukesh", "Rakesh", "Imran", "Salman", "Vinod", "Deepak", "Pankaj",
  "Suresh", "Manoj", "Ramesh", "Naveen", "Irfan"];
const BASE_FEES = [500, 550, 600, 700, 750, 800, 850, 900, 1000, 1100, 1200, 1300, 1400];
const MODES = ["Cash", "UPI", "Cash", "UPI", "Cheque"];

export function buildSeed() {
  const rand = rng(2026);
  const pick = (a) => a[Math.floor(rand() * a.length)];

  const fees = {};
  CLASSES.forEach((c, i) => (fees[c] = BASE_FEES[i]));

  const rollCount = {};
  const students = [];
  for (let i = 0; i < 500; i++) {
    const cls = CLASSES[i % CLASSES.length];
    rollCount[cls] = (rollCount[cls] || 0) + 1;
    const last = pick(LAST);
    students.push({
      id: "S" + String(i + 1).padStart(4, "0"),
      name: `${pick(FIRST)} ${last}`,
      cls,
      roll: rollCount[cls],
      parent: `${pick(PARENT)} ${last}`,
      phone: "9" + String(Math.floor(100000000 + rand() * 899999999)),
    });
  }

  const months = monthsElapsed();
  const start = new Date(sessionStartYear(), 3, 1).getTime();
  const now = Date.now();
  const raw = [];
  for (const s of students) {
    const expected = months * fees[s.cls];
    const r = rand();
    let paid;
    if (r < 0.55) paid = expected;
    else if (r < 0.82) paid = Math.round((expected * (0.3 + rand() * 0.5)) / 50) * 50;
    else if (r < 0.92) paid = Math.round((expected * rand() * 0.2) / 50) * 50;
    else paid = 0;
    if (paid > 0) {
      raw.push({
        studentId: s.id,
        amount: paid,
        mode: pick(MODES),
        note: "",
        date: new Date(start + rand() * (now - start)).toISOString(),
      });
    }
  }
  raw.sort((a, b) => a.date.localeCompare(b.date));
  const payments = raw.map((p, i) => ({ ...p, id: "R-" + String(i + 1).padStart(4, "0") }));

  return { students, fees, payments, nextReceipt: payments.length + 1 };
}
