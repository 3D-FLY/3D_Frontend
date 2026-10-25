---
paths:
  - "src/**/*.{tsx,jsx,css}"
  - "tailwind.config.js"
---

# Styling

## Where tokens are defined
- `tailwind.config.js`: `dark` (DEFAULT `#222222`), `green` (DEFAULT and **500 = `#5ac422`**), `gray` (DEFAULT and 500 = `#959595`, plus `1000 = #D9D9D9`), and the font families `sans` (Montserrat), `staatliches`, `inter`.
- `src/index.css`: loads Tailwind v4 with `@import "tailwindcss"` + `@config "../tailwind.config.js"`, re-declares `--color-dark/green/gray` and fonts in `@theme`, sets `--nav-h: 72px`, gives `h1–h6` Montserrat 900 italic by default, and defines the `.scrollbar-native-hidden` utility.
- Don't add new global CSS files. The existing per-feature CSS files (`navbar.css`, `MainSection.css`, `whatCanYouSell.css`, `registration-form.css`) are legacy.

## Colors
- **Brand green: use `bg-green-500` / `text-green-500` / `border-green-500`** (and opacity variants like `bg-green-500/10`). Don't write `bg-[#5ac422]` or bare `bg-green` in new code (both exist and are legacy).
- Raw `#5ac422` is allowed only where classes can't be used: inline `style`, Recharts props (`stroke="#5ac422"` in `src/pages/dashboard/supplier/SupplierPayments.tsx`), and Framer `animate` color values (`src/pages/Explore.jsx`).
- Dashboard surfaces are dark: page `bg-dark`, text `text-white` / `text-zinc-100…500`, dividers `bg-white/10`, borders `border-white/10`. Use `zinc-*` for neutrals in dashboard code (341 uses). `slate-*` appears in a few landing files only.
- Glass card surface: `border border-white/10 bg-[rgba(149,149,149,0.1)] backdrop-blur-[12px] rounded-2xl`. Don't recreate it; use `DashboardCard` (see `src/features/dashboard/components/DashboardCard.tsx`) or `EntityCard`.
- Text inputs on dark: `rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] … focus:border-green-500`. See `searchInputClass` in `src/pages/dashboard/admin/AdminDashboard.tsx`.
- Status colors come from `ORDER_STATUS_CONFIG` (`dot`, `text`, `border`, `bg` classes) in `src/constants/orderStatusConfig.ts`. The KPI accent palette is `"green" | "yellow" | "orange" | "blue" | "red"` (`StatusBadge.tsx`). Never invent a status color.

## Tailwind vs inline style
- Tailwind classes by default.
- Inline `style={{}}` is used for (a) layout math from JS constants (`NAVBAR_H`, `SIDEBAR_W` in `src/features/dashboard/DashboardLayout.tsx`), and (b) runtime colors such as an entity's `accentColor` (`EntityCard.tsx`). Keep inline style to those two cases.
- Fluid type uses `clamp()` in arbitrary values: `text-[clamp(16px,1.6vw,24px)]` (card title) and `text-[clamp(22px,2.5vw,32px)]` (page title, `DASHBOARD_PAGE_TITLE_CLASS`).
- Uppercase labels are done with CSS (`uppercase tracking-wide` / `tracking-[0.1em]`), not by uppercasing the source string. See `Sidebar.tsx` and `DashboardCard.tsx`.
- Join conditional classes with template literals or an array `.join(" ")` (`Sidebar.tsx`). There's no `clsx`/`cn` helper in the repo, so don't add one.

## Animation (Framer Motion)
Reuse the existing motion values:
- `DashboardLayout` already animates every page enter (`opacity 0→1, y 16→0, 0.3s, easeOut`, keyed by pathname).
- Open question: all seller and supplier pages *also* wrap their content in a second `motion.div` (`y 12→0, 0.4s easeOut`, e.g. `src/pages/dashboard/supplier/SupplierOrders.tsx`), while admin pages don't (`AdminDashboard.tsx`). Match the role you're working in until this is decided.
- Cards: `DashboardCard` animates `y 12→0, 0.25s easeOut, delay index*0.05`. Pass an increasing `index` prop to stagger cards (see `AdminDashboard.tsx`: `index={0..3}`).
- Layout chrome uses `duration 0.55, ease [0.4, 0, 0.2, 1]` (DashboardLayout banner). Keep that only for chrome.
- A variants object literal with `ease: "easeOut"` widens to `string` and fails typecheck (existing errors in `src/pages/dashboard/seller/Integration.tsx` and `Products.tsx`). Write `transition` inline on the element as `DashboardCard` does, or annotate the object as `Variants` from framer-motion.

## Charts (Recharts)
Follow `src/pages/dashboard/supplier/SupplierPayments.tsx`: wrap in `ResponsiveContainer width="100%"` inside a `DashboardCard autoHeight`; grid `stroke="rgba(255,255,255,0.06)"`; axis ticks `{ fill: "#71717a", fontSize: 12 }`, `axisLine={false} tickLine={false}`; tooltip `contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}`; series stroke `#5ac422`, `strokeWidth={2}`, `dot={false}`.

## Fonts
Montserrat (`font-sans`) everywhere. `font-staatliches` and `font-inter` are for specific landing elements only.
