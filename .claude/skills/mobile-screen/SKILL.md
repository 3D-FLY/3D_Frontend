---
name: mobile-screen
description: Use when adapting an existing dashboard page (Admin/Seller/Supplier) or a landing section to mobile widths. Based on the repo's existing responsive patterns (WhatCanYouSell mobile/desktop split, mobile-first grids).
---

# Mobile screen

## Current state (read before starting)
- **The dashboard shell has no mobile layout.** `src/features/dashboard/DashboardLayout.tsx` uses a fixed 210px sidebar (`SIDEBAR_W`), a fixed 72px navbar, `marginLeft: SIDEBAR_W`, and 50px side padding, all as inline-style constants. On a phone, page content gets ~100px of width.
- Inside pages, grids are already mostly mobile-first (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` in `AdminDashboard.tsx`). `DashboardTable` uses fixed `gridTemplateColumns` (e.g. 11 columns in `SupplierOrders.tsx`), so it won't fit a phone.
- Landing already has a working pattern: `src/features/home/WhatCanYouSell/WhatCanYouSell.tsx`.

**Step 0: settle the shell first.** If the task touches any dashboard page and DashboardLayout still has no mobile branch, stop and ask the user how the sidebar should behave on mobile (e.g. drawer like `Navbar.jsx`'s menu, or a bottom bar) and at which breakpoint. The repo uses `md` (landing sections), `lg` (HowItWorks) and 1280px (Navbar), and there's no decided standard. Record the answer in `.claude/rules/dashboards.md` before writing code.

## Pattern A: structural split (different layout on mobile)
Use this when the mobile UI is a different composition (cards instead of a table, a pager instead of a grid).
1. Keep the existing desktop component and rename it only if it's new code. For existing files, extract the part to split.
2. Create `<Name>Mobile.tsx` next to it. Create `<Name>Desktop.tsx` only if the desktop part is newly extracted.
3. The parent switches between them **with CSS, not JS**:
   ```tsx
   <div className="md:hidden"><NameMobile /></div>
   <div className="hidden md:block"><NameDesktop /></div>
   ```
   (exactly as in `WhatCanYouSell.tsx`, and at card level in `src/features/home/Features/Features.jsx` with `InfoCardMobile`/`InfoCardDesktop`).
4. Both variants read the **same data source** (same `src/data` import or adapter function). Never fork the data.
5. Mobile lists of table rows: render each row as a stacked card using the same row type and the same `OrderStatusPill`/`StatusBadge`, and keep `onRowClick` navigation identical.

## Pattern B: responsive utilities (same structure)
For spacing, column count, and visibility tweaks, use Tailwind prefixes in the one component: `px-6 md:px-10`, `grid-cols-1 lg:grid-cols-2`, `hidden md:flex` (ProgressDots in `src/pages/Explore.jsx`). Fluid text already uses `clamp()` (`DashboardCard` title), so leave that alone.

## Rules
- No `window.innerWidth` checks for layout. CSS breakpoints only. (`Navbar.jsx` and `WhatCanYouSellDesktop.jsx` use it only for behavior: closing the menu, carousel math.)
- Use `svh` for mobile viewport heights and `dvh` on desktop (`Home.jsx`: `h-[calc(100svh-var(--nav-h))] lg:h-[calc(100dvh-var(--nav-h))]`).
- Touch targets at least `h-8 w-8` (the existing icon buttons in `EntityCard.tsx`).
- Keep `DashboardCard` as the container on mobile. Use `autoHeight` so fixed `clamp(170px,20vw,300px)` heights don't clip content.
- Labels and copy stay identical between variants (same title case strings).

## Verify
- `npm run dev`, then use browser devtools at 375px, 768px, and 1280px. Check that there's no horizontal scroll (`overflow-x` on body) and that both variants never render at the same time.
- `npx tsc --noEmit`: no new errors.
