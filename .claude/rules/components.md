---
paths:
  - "src/components/**"
  - "src/features/**/*.{tsx,jsx}"
---

# Components

## Shape of a component
- One component per file, **default export of a named function**: `export default function DashboardCard(...)`. See `src/features/dashboard/components/DashboardCard.tsx`, `Modal.tsx`, `OrderStatusPill.tsx`.
- Props are typed with an `interface <Name>Props` declared just above the component and destructured in the signature, **with defaults set in the destructuring** (`className = ""`, `size = "md"`). See `src/features/dashboard/components/Modal.tsx`.
- Every visual component accepts `className?: string` and appends it last: `` className={`... ${className}`} ``. See `DashboardCard.tsx`, `ActiveBadge.tsx`.
- Small helper subcomponents used by only one file stay in that file, above the default export, and aren't exported. See `CustomScrollbar` in `src/features/dashboard/components/ScrollableContent.tsx` and `ProductCard` in `src/features/home/WhatCanYouSell/WhatCanYouSellMobile.tsx`.
- Named extra exports are fine for closely tied pieces: `DashboardPageTitle` and `DASHBOARD_PAGE_TITLE_CLASS` in `src/features/dashboard/components/DashboardPage.tsx`, `roleInboxPath` and `SidebarRole` in `Sidebar.tsx`.
- Role-aware shared components take `role: SidebarRole` and branch internally instead of being forked per role. See `NotificationsList.tsx` and `DashboardMap.tsx`, which are reused by every role's page.

## Where a component lives
| Location | Holds | Examples |
|---|---|---|
| `src/components/ui/` | Site-wide primitives used by landing **and/or** auth **and/or** dashboard | `Button.jsx`, `Input.tsx`, `Turtle.jsx`, `LogoLoader.tsx`, `SectionLoader.tsx`, `SectionTitle.tsx` |
| `src/components/layout/` | Global chrome | `Navbar.jsx`, `Footer.tsx`, `FooterSlim.tsx` |
| `src/features/dashboard/components/` | Anything used by 2+ dashboard pages or 2+ roles | `DashboardTable.tsx`, `StatusBadge.tsx`, `EntityCard.tsx` |
| `src/features/<feature>/` | Used only inside that feature (flat, no `components/` subfolder) | `src/features/home/HowItWorks/HowItWorksStep.jsx` |
| Inside the page file | Used by one page only | `SupplierModal` in `src/pages/dashboard/admin/SuppliersPage.jsx` |

## Reuse before creating
Before writing new UI, check this list:
- Card / panel → `DashboardCard` (supports `viewAllTo`, `headerAction`, `loading`, `autoHeight`, `fill`, `index`)
- Table / list rows → `DashboardTable` (`variant="list" | "data"`, `renderCell`, `gridTemplateColumns`, `onRowClick`, `cap`, `emptyMessage`). See `src/pages/dashboard/admin/AdminDashboard.tsx`.
- KPI tile → `StatusBadge` (`count`, `label`, `accentColor`)
- Order status chip → `OrderStatusPill status={…}`. Active/inactive chip → `ActiveBadge`.
- Dialog → `Modal` (`onClose`, `size="sm"|"md"|"lg"`)
- Text input → `Input` from `src/components/ui/Input.tsx` (label, error, password toggle, `endAccessory`)
- Inner scroll area → `ScrollableContent` (custom green scrollbar, bottom fade)
- Loading → `SectionLoader` (inside a card), `LogoLoaderOverlay` (maps), `LoadingPage` (route fallback)
- Brand watermark → `Turtle`. Section heading on landing/auth → `SectionTitle`.

## Icons
- UI icons in dashboard and FAQ code come from `lucide-react` (26 files, e.g. `Sidebar.tsx`, `EntityCard.tsx`), sized with `size={16}`.
- Brand/illustrative icons are SVG files. Use `?url` for `<img>` (`Turtle.jsx` imports `logo.svg?url`) or `?react` for an inline component (vite-plugin-svgr). Shared ones go in `src/assets/icons/`, feature-only ones in `src/features/<x>/assets/icons/`, and hand-written JSX icon components in `src/features/<x>/icons/` (e.g. `src/features/auth/icons/IconEyeHide.jsx`).
- Open question: `.cursor/rules/figma-mcp.mdc` says "do not add icon packages", which conflicts with existing lucide-react use. Don't add a *new* icon package either way.
