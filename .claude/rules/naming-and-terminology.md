---
paths:
  - "src/**"
---

# Naming and terminology

## Files
- Components: `PascalCase.tsx`, matching the default export (`DashboardCard.tsx` → `DashboardCard`).
- Data and config modules: `camelCase.ts` (`mockOrders.ts`, `orderStatusConfig.ts`, `exploreContent.ts`, `footerConfig.ts`).
- Mock data: `mock<Entities>.ts`, plural (`mockSellers`, `mockSuppliers`). Exported arrays use the same name.
- JSX icon components: `Icon<Name>.jsx|tsx` (`IconEyeHide.jsx`, `IconArrow.jsx`).
- Mobile/desktop variants: `<Name>Mobile.tsx` / `<Name>Desktop.tsx` (`WhatCanYouSellMobile.tsx`).
- **New dashboard page files: `<Role><Name>.tsx`** in every role, e.g. `SupplierOrders.tsx`, `SellerAnalytics.tsx`, `AdminReports.tsx`. Existing admin (`UsersPage.tsx`, `OrdersPage.jsx`) and seller (`Orders.tsx`) files keep their names for now. Open question: rename them in a separate task.
- New lazy import consts in `App.jsx`: `<Role><Name>Page` (`SupplierOrdersPage`, `SellerBillingPage`, `AdminNotificationsPage`). Older admin consts have no prefix (`OrdersPage`, `UsersPage`).

## Code identifiers
- Props interface: `<Component>Props`. Union string types for variants: `variant?: "list" | "data"`, `size?: "sm" | "md" | "lg"`.
- Module-level constants: `SCREAMING_SNAKE_CASE` (`NAVBAR_H`, `ORDER_STATUS_CONFIG`, `RECENT_ORDERS_COLUMNS`, `CURRENT_SELLER_ID`).
- Status keys are `snake_case` string literals (`in_production`). Domain types are singular PascalCase (`Order`, `Seller`, `Supplier`, `Notification`).
- Roles in code: `admin`, `seller`, `supplier` (lowercase). Never `shop` or `store` as a role value.

## UI vocabulary
- **"Notifications"**, never "Alerts" (sidebar, routes `/notifications`, `NotificationsList`, `mockNotifications`).
- The seller's own area is called **"My Store"** (sidebar item and banner `MY STORE`). Admin refers to sellers' businesses as stores (`StoresPage`).
- **"Suppliers"** are print farms. **"Capabilities"** is the supplier's technologies/materials/colors page.
- Order steps (timeline): "Order Placed", "Sent to Supplier", "Printer", "Shipped", "DONE". Status labels come from `ORDER_STATUS_CONFIG` (e.g. "Printing", "DONE").
- Print tech values: `"FDM" | "SLS" | "SLA"`. Platforms are lowercase ids: `shopify`, `etsy`, `ebay`, `amazon`, `wix`, `woocommerce`.
- Currency is USD and displayed as `` `$${n.toLocaleString()}` ``.

## Casing
- **Write UI strings in title case in source** ("Recent Orders", "Supplier Map"). Visual uppercase comes from CSS `uppercase` (as in `Sidebar.tsx`, `DashboardCard.tsx`). Existing uppercase strings (`"ORDERS"`, `"REVENUES"`, `"EARNINGS OVER TIME"` in supplier pages) are legacy.

## Comments
- **New comments are in English.** Existing Hebrew comments stay untouched (don't translate or delete them as a side change).
- Section dividers in long files use the box-drawing style `// ─── Title ───…` (see `src/pages/dashboard/admin/SuppliersPage.jsx`, `src/components/ui/Input.tsx`). JSX regions use `{/* NAME — note */}` (see `DashboardLayout.tsx`).

## Open questions
- "Revenue" (column headers and stats in `SupplierOrders.tsx`, `SupplierHome.tsx`, `FinancePage.tsx`) vs "Revenues" (supplier sidebar item and page title). The supplier route is `/revenue`, its file is `SupplierPayments.tsx`, and admin's "Payments" page is `FinancePage.tsx`.
- Admin sidebar item label "Store" (singular) vs page title "Stores".
