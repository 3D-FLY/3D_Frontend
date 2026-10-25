---
name: new-dashboard-page
description: Use when adding a new page (list, detail, settings, placeholder) to the Admin, Seller, or Supplier dashboard. Covers the page file, the route in src/App.jsx, the sidebar item, layout and cards, and wiring mock data.
---

# New dashboard page

Reference pages: `src/pages/dashboard/admin/AdminDashboard.tsx` (cards + table), `src/pages/dashboard/supplier/SupplierPayments.tsx` (KPIs + chart + table), `src/pages/dashboard/admin/StoresPage.tsx` (placeholder), `src/pages/dashboard/supplier/SupplierNotifications.tsx` (role-agnostic wrapper).

## 1. Decide the shape
- Does the same feature exist for another role? Then build or extend a **shared component** taking `role: SidebarRole` in `src/features/dashboard/components/` (like `NotificationsList`, `DashboardMap`), and make the page a 5-line wrapper.
- Is it a detail page? Route it as `/dashboard/<role>/<page>/:id` and read the id with `useParams()`. Order ids in URLs have no `#`.

## 2. Create the file
- Path: `src/pages/dashboard/<role>/<Role><Name>.tsx` (e.g. `SupplierReports.tsx`, `SellerAnalytics.tsx`, `AdminReports.tsx`).
- Start from `template.md` in this folder (kept as .md because tsconfig has no `include`, so a .tsx here would be typechecked). Use `.js` extensions on TS imports.
- Wrap in `<DashboardLayout role="<role>">` → `<DashboardPage title="…">` (or `header={…}` with `<DashboardPageTitle>`).
- Seller/supplier pages currently add an inner page-enter `motion.div` (see `SupplierOrders.tsx`). Match the role's existing pages, which is an open question in `.claude/rules/styling.md`.
- Title in title case ("Reports"), never `"REPORTS"`.

## 3. Build the content from the kit (don't write new primitives first)
- KPIs → grid `grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4` of `StatusBadge`.
- Sections → `DashboardCard` with increasing `index`, `autoHeight` for content-sized cards, `viewAllTo` for "View All →".
- Lists → `DashboardTable` with a module-level `COLUMNS` const and `renderCell` switch. Statuses → `OrderStatusPill`.
- Dialogs → `Modal`. Inputs → `Input`. Charts → Recharts styled as in `SupplierPayments.tsx`.

## 4. Data
- Import from `src/data/*.ts` (written with a `.js` specifier), and filter by `CURRENT_SELLER_ID` / `CURRENT_SUPPLIER_ID` from `src/data/currentUser.ts`.
- Need a role-specific shape? Add a derive-only function to the role adapter (`src/pages/dashboard/supplier/mockSupplier.ts`, `src/pages/dashboard/seller/mockProducts.ts`). Need new records? Use the `add-mock-data` skill.
- Status labels and colors only from `src/constants/orderStatusConfig.ts`.

## 5. Route (src/App.jsx)
- Add a lazy import next to the role's others: `const SupplierReportsPage = lazy(() => import("./pages/dashboard/supplier/SupplierReports.tsx"));`
- Add the `<Route>` **above** the role's `/dashboard/<role>/*` catch-all and above any less specific sibling:
  ```jsx
  <Route path="/dashboard/supplier/reports" element={<Suspense fallback={<LoadingPage />}><SupplierReportsPage /></Suspense>} />
  ```
  Fallback: `<LoadingPage />` for supplier, `null` for admin/seller (current convention, still an open question).

## 6. Sidebar
- Append `{ label: "Reports", to: "/dashboard/supplier/reports", icon: <LucideIcon> }` to the role's array in `src/features/dashboard/components/Sidebar.tsx` and add the icon to the lucide import. Skip this for detail pages.

## 7. Verify
- `npx tsc --noEmit` and `npm run lint`: no new errors compared to before.
- `npm run dev`: open the route, check that the sidebar highlights the item, cards stagger in, and no layout offsets were added by hand.
