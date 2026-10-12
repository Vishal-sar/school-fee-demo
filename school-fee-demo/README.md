# School Fee Management: Demo

Phase 1 demo: dashboard, students, fee collection, printable receipts, defaulters (CSV export), fee structure.
500 dummy students are pre-loaded. No WhatsApp reminders.

**Demo limitation:** data is stored in the browser (localStorage), not a database. Each device/browser sees its own copy.
Production version will need a real backend (Django + PostgreSQL) with login and roles.

## Run locally
```
npm install
npm run dev
```

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. vercel.com -> Add New Project -> import the repo -> Deploy (no settings needed).

Or from the terminal: `npx vercel` (then `npx vercel --prod`).
