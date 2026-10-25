# 3D-Fly Frontend

3D-Fly is a 3D-printing marketplace. It connects online stores (sellers) with nearby print-farm suppliers, so products are printed and shipped on demand with no inventory.
This repo is the web frontend: a public landing site and three role dashboards (Admin, Seller, Supplier). There is no backend yet, and all data is mock data in `src/data/`.

## Stack
Vite 7 · React 18 · React Router 7 (`BrowserRouter`, flat `<Routes>` in `src/App.jsx`) · Tailwind CSS v4 (PostCSS plugin, legacy config loaded via `@config` in `src/index.css`) · Framer Motion · lucide-react · Recharts · react-simple-maps · react-select · country-state-city · vite-plugin-svgr.
TypeScript is strict (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `module: nodenext`). There are no path aliases, so every import is relative.

## Commands
```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # production build
npm run lint       # ESLint (only lints .js/.jsx files)
npx tsc --noEmit   # typecheck (no npm script exists)
```
Baseline: `tsc` and `lint` already report errors on `main` (14 and 16 as of 2026-10-25). Don't add new ones. Compare the counts before and after a change.

## Folder map (src/)
```
App.jsx, main.jsx        routes + entry (all routes live in App.jsx)
pages/                   landing route pages (Home, Explore, FAQPage, ...)
pages/dashboard/{admin,seller,supplier}/   one file per dashboard page + role mock adapters
features/dashboard/      DashboardLayout + shared dashboard kit (components/)
features/home/           landing-page sections (one folder per section)
features/{auth,network,Explore,Store}/     login/registration, partner map, explore content, store tags
components/{ui,layout}/  site-wide primitives (Button, Input, Turtle, loaders) and Navbar/Footer/FooterSlim
data/                    canonical mock data shared by all roles
constants/               orderStatusConfig.ts (order status source of truth)
assets/icons/            icons shared across features
```

## Critical rules
1. **New files are TypeScript** (`.ts`/`.tsx`). Inside TS files, import TS siblings with a **`.js` extension** (`import DashboardCard from "./DashboardCard.js"`). `nodenext` requires it.
2. **Roles are exactly `"admin" | "seller" | "supplier"`** (`SidebarRole` in `src/features/dashboard/components/Sidebar.tsx`). Never use `"shop"`. Dashboard URLs are `/dashboard/<role>/<page>`.
3. **Every dashboard page renders `<DashboardLayout role=…>` → `<DashboardPage>` → `<DashboardCard>`s.** Never hand-build page chrome, offsets, or glass cards.
4. **Reuse before you build.** Check `src/features/dashboard/components/` and `src/components/ui/` first (DashboardTable, StatusBadge, OrderStatusPill, Modal, Input, Button, ScrollableContent, NotificationsList…).
5. **Mock data comes only from `src/data/`** (or a role adapter that derives from it). Never paste a second copy of orders, products, sellers, or suppliers into a page. Keep IDs linked across roles: `SEL-001`, `SUP-001`, `${sellerId}-PRD-001`, `#0041`.
6. **Order statuses** come only from `src/constants/orderStatusConfig.ts` (keys, labels, colors). Never hardcode a status label or status color.
7. **Brand green `#5ac422` is written as `*-green-500`** in classes. Raw hex is allowed only where classes can't reach (inline `style`, Recharts props, Framer `animate` values).
8. **Terminology:** "Notifications" (never "Alerts"). UI strings are in title case in source, and uppercasing is done with CSS `uppercase`.
9. **New code comments are in English.** Leave existing Hebrew comments as they are.

## Path-scoped rules (load automatically for matching files)
- `.claude/rules/components.md`: component structure, props, where shared components go
- `.claude/rules/styling.md`: colors, Tailwind, dark theme, Framer Motion, Recharts styling
- `.claude/rules/dashboards.md`: role routing, sidebar, page anatomy
- `.claude/rules/data.md`: mock data, IDs, adapters, status constants
- `.claude/rules/landing.md`: landing sections, mobile/desktop split, Explore
- `.claude/rules/naming-and-terminology.md`: file/component naming, UI vocabulary, comments
- `.claude/rules/typescript.md`: import extensions, `.d.ts` shims for JSX, strict-mode patterns

## Skills (`.claude/skills/`)
- `new-dashboard-page`: add a page to a role dashboard (route, sidebar, layout, data)
- `new-shared-component`: decide shared vs feature-local and create it
- `add-mock-data`: extend mock data while keeping cross-role consistency
- `mobile-screen`: adapt a dashboard page to mobile
- `feature-spec`: write an 8-section spec to hand a task to another developer

## Open questions (not decided, so don't codify; ask the user)
- Rename existing admin/seller page files to `<Role><Name>.tsx` (planned as a separate task).
- "Revenue" vs "Revenues"; supplier route `/revenue` lives in `SupplierPayments.tsx`; admin "Payments" lives in `FinancePage.tsx`.
- Admin sidebar label "Store" vs route `/stores`; "seller" in code vs "store" in UI copy.
- Two admin map routes (`/supplier-map` via `AdminDashboardShell`, `/map` via `DashboardMap`).
- Suspense fallback: `null` (admin/seller) vs `<LoadingPage />` (supplier).
- Landing mobile breakpoint: `md` (most sections) vs `lg` (HowItWorks) vs 1280px (Navbar). Dashboards use `md`, and their mobile shell is configured per role in `src/features/dashboard/mobileNav.ts` (Seller/Supplier still to be designed).
- Dead/duplicate code: `pages/SellerDashboard.tsx`, `pages/dashboard/seller/mockOrders.ts`, `HorizontalCarousel`, `NotificationList` vs `NotificationsList`, `mockSupplierPayments` and `mockSupplierRevenue` in `pages/dashboard/supplier/mockSupplier.ts` (unused; `SupplierPayments.tsx` builds its own from `mockOrders`).

## Context files
**Edit only `.claude/` (and this CLAUDE.md). Cursor files are pointers.**
`.cursor/rules/*.mdc` contain only `@` references to `.claude/rules/*` and `CLAUDE.md`. Cursor reads `.claude/skills/` natively. Never copy rule text into `.cursor/`. When you add a rule here, add a matching pointer `.mdc` with the same globs.
