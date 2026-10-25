---
paths:
  - "src/**/*.{ts,tsx}"
---

# TypeScript

## Direction
The codebase is migrating JS → TS. All of `src/data/`, `src/constants/`, and the seller/supplier pages are already TS. Remaining JSX: `App.jsx`, `main.jsx`, most of `src/features/home/`, `src/features/network/`, `Navbar.jsx`, some `src/components/ui/` (Button, Turtle, Background, GlowCircle…), and five admin pages (`OrdersPage`, `SettingsPage`, `SuppliersPage`, `SupplierDetailPage`, `SupplierMapPage`). **Every new file is `.ts`/`.tsx`.** Don't convert an existing `.jsx` file as a side effect of another task.

## Imports (tsconfig `module: nodenext`)
- Relative imports **must have an extension**. For a TS target, write **`.js`**: `import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";` (see any file in `src/pages/dashboard/supplier/`). tsc reports an error for extensionless imports (e.g. the existing error in `src/pages/FAQPage.tsx`).
- For a JSX target, write `.jsx` (`import Turtle from "../../components/ui/Turtle.jsx";` in `DashboardLayout.tsx`).
- `verbatimModuleSyntax` is on, so type-only imports use `import type { … }` or inline `type` (`import { ORDER_STATUS_CONFIG, type OrderStatusKey } from "…/orderStatusConfig.js";`).

## Importing JSX modules from TS
An untyped JSX module consumed from TS needs a module declaration:
- Colocated `.d.ts` next to the module: `src/features/network/WorldMap.d.ts`, `PartnerLocationsContext.d.ts`, `worldGeoCache.d.ts`, `src/features/home/Features/icons/index.d.ts`.
- Or a wildcard `declare module "*/…/X.jsx"` in `src/vite-env.d.ts` (Button, Turtle, GlowCircle) or `src/features/dashboard/components/jsx-modules.d.ts`.
Prefer the colocated `.d.ts`. Asset modules (`*.svg?url`, `*.svg?react`, `*.png`) are declared in `src/vite-env.d.ts`.

## Strict-mode patterns used here
- `exactOptionalPropertyTypes`: don't pass a possibly-undefined value to an optional prop (the existing errors in `DashboardTable.tsx` forwarding `scrollbarSide` are exactly this). Spread conditionally: `{...(cond && { onClick: () => … })}` (`AdminDashboard.tsx`). If a prop legitimately accepts undefined, type it `?: T | undefined` (`supplierInstructionImages?: string[] | undefined` in `src/data/mockProducts.ts`).
- `noUncheckedIndexedAccess`: indexed reads are `T | undefined`. Use `find(...)?.x ?? "Unknown"` (the established fallback string, see `AdminDashboard.tsx`, `mockSupplier.ts`).
- Derive union types from const arrays: `export const ORDER_STATUS_KEYS = [...] as const; export type OrderStatusKey = (typeof ORDER_STATUS_KEYS)[number];` and use `satisfies` for typed subsets (`SUPPLIER_EDITABLE_STATUS_KEYS`).
- `Record<Union, T>` for per-key maps (`ORDER_STATUS_CONFIG`, `roleLabels` in `DashboardLayout.tsx`).

## Checks
`npx tsc --noEmit` (no npm script). The baseline has existing errors, so make sure your change adds none.
