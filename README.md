# 3D-Fly — Frontend

3D-Fly is a 3D-printing marketplace. It connects online stores with nearby print-farm suppliers, so products are printed and shipped on demand with no inventory.
This repo is the web frontend: the public landing site plus the Admin, Seller and Supplier dashboards. All data is currently mock data (`src/data/`).

**Stack:** React 18 · TypeScript (migrating from JS) · Vite 7 · React Router 7 · Tailwind CSS v4 · Framer Motion · Recharts

## Getting started
Requires Node.js ≥ 18.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (`.js`/`.jsx`) |
| `npx tsc --noEmit` | Typecheck |

## Dashboards
| Role | Entry URL |
|---|---|
| Admin | `/dashboard/admin` |
| Seller | `/dashboard/seller` |
| Supplier | `/dashboard/supplier` |

## Conventions
Project structure, coding rules and workflows are documented in [CLAUDE.md](CLAUDE.md) and `.claude/rules/`. They're used by Claude Code and Cursor and are the source of truth for contributors too.

## Related repos
| Repo | Stack |
|---|---|
| `3D_Backend` | Spring Boot |
| `3D_Mobile` | Expo / React Native |
