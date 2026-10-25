---
paths:
  - "src/pages/dashboard/**"
  - "src/features/dashboard/**"
  - "src/App.jsx"
---

# Role dashboards (Admin / Seller / Supplier)

## Roles and URLs
- `SidebarRole = "admin" | "seller" | "supplier"` in `src/features/dashboard/components/Sidebar.tsx`. This is the only role type. `NotificationRole` in `src/data/mockNotifications.ts` uses the same three values.
- URLs follow `/dashboard/<role>/<page>`, with detail pages at `/dashboard/<role>/<page>/:id`. Each role has a catch-all home route: `/dashboard/<role>/*` → `AdminDashboard` / `MyStore` / `SupplierHome`.
- Page files live in `src/pages/dashboard/<role>/`.
- Role banner labels come from `roleLabels` in `src/features/dashboard/DashboardLayout.tsx`: `ADMIN`, `MY STORE`, `SUPPLIER`.

## Routing (src/App.jsx)
- Routes are flat (no nested `<Outlet>` layout routes for dashboards). Declare **more specific paths before less specific ones** (`orders/:id` before `orders`, before `<role>/*`).
- Dashboard pages are lazy: `const SupplierOrdersPage = lazy(() => import("./pages/dashboard/supplier/SupplierOrders.tsx"));`, rendered inside `<Suspense fallback={…}>`.
- Dashboard routes sit **outside** `MainLayout`, so the landing Navbar/Footer don't render there.
- Renamed paths use `<Navigate replace>` (see `/dashboard/supplier/payments` → `/revenue`).

## Sidebar
- Nav items are static arrays `adminItems` / `sellerItems` / `supplierItems` of `{ label, to, icon }`, where `icon` is a lucide-react component. To add a page to the nav, append to the role's array. The order of the array is the display order.
- The role home item (`/dashboard/<role>`) needs `end` matching. That's already handled in the `end={…}` expression, so a new home-level path must be added there.
- Notifications links are built with `roleInboxPath(role, id?)`.

## Page anatomy (reference: `src/pages/dashboard/admin/AdminDashboard.tsx`, `src/pages/dashboard/supplier/SupplierPayments.tsx`)
```tsx
export default function SupplierExample() {
  return (
    <DashboardLayout role="supplier">
      <DashboardPage title="Example">            {/* or header={<…custom row with <DashboardPageTitle>…>} */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">{/* StatusBadge KPIs */}</div>
        <DashboardCard index={0} title="Recent Orders" autoHeight viewAllTo="/dashboard/supplier/orders">
          <DashboardTable … />
        </DashboardCard>
      </DashboardPage>
    </DashboardLayout>
  );
}
```
- The page owns `<DashboardLayout role>`. The layout gives the fixed navbar (72px), sidebar (210px), green role banner, glow background, the `Turtle` watermark, page-enter motion, a max width of 1320px, and `FooterSlim`. **Never add top/left offsets, backgrounds, or a footer in a page.**
- `DashboardPage` provides `space-y-6`. Use `title` for a simple heading or `header` for a row with actions, back button, or badges.
- Grids are mobile-first: `grid-cols-1` then `sm:`/`lg:`/`xl:` columns, with `gap-6`.
- Derived data (filters, KPIs, table rows) is computed at **module level** from `src/data` when it doesn't depend on state (see `statusCards`, `recentOrders` in `AdminDashboard.tsx`). Inside the component it goes in `useMemo`.
- Table column definitions are a module-level `const …_COLUMNS = [{ key, header }]` plus `renderCell` with a `switch (key)`.
- Navigation uses `useNavigate()`. Order IDs drop the `#` in URLs (`o.id.replace("#", "")`).
- Role-agnostic features (Notifications, Global map) are shared components with `role`. The page file is a 5-line wrapper: see `src/pages/dashboard/supplier/SupplierNotifications.tsx` and `src/pages/dashboard/admin/MapPage.tsx`.
- Placeholder pages use the "Coming Soon" card from `src/pages/dashboard/admin/StoresPage.tsx`.

## Open questions
- Seller and supplier pages wrap `DashboardPage` in an extra page-enter `motion.div`, and admin pages don't (see styling.md).
- Suspense fallback differs: `null` (admin/seller) vs `<LoadingPage />` (supplier). Follow the role you're working in until this is decided.
- `AdminDashboardShell` (layout in the route, `/dashboard/admin/supplier-map`) vs layout inside the page (everything else). Use layout-inside-page for new pages.
- Admin has both `/supplier-map` and `/map`. The sidebar label "Store" points at `/stores`.
- There's no mobile dashboard shell yet (see the `mobile-screen` skill).
