---
name: add-mock-data
description: Use when adding or changing mock records (orders, products, sellers, suppliers, notifications) or adding a field to a mock entity, so that Admin, Seller and Supplier views stay consistent with each other.
---

# Add mock data

All three dashboards read the same arrays in `src/data/`. One record shows up in several places: an order appears in the admin Orders page, the seller Orders/Billing pages, and the supplier Orders/Revenues pages. Rules: `.claude/rules/data.md`.

## Adding a seller
1. Append to `mockSellers` in `src/data/mockSellers.ts` with the next id `SEL-00n` and lowercase `platforms` ids.
2. Generate their products: add `...makeProductsForSeller("SEL-00n", [platforms])` to `mockProducts` in `src/data/mockProducts.ts` (ids become `SEL-00n-PRD-001…`).
3. Optionally add orders (below) so the admin views aren't empty.

## Adding a supplier
1. Append to `mockSuppliers` in `src/data/mockSuppliers.ts` with the next `SUP-00n`. `coordinates` is **`[lng, lat]`**, and `technologies` ⊆ `"FDM" | "SLS" | "SLA"`.
2. It appears automatically on the maps (`DashboardMap`, `SupplierMapPage.jsx`) and in the admin Suppliers list.

## Adding an order
1. Next id is `"#00nn"` (currently up to `#0047`). Check for collisions with `grep -o 'id: "#[0-9]*"' src/data/mockOrders.ts`.
2. `productId` must exist in `mockProducts`, **and its `sellerId` must equal the order's `sellerId`**. `supplierId` must exist in `mockSuppliers`.
3. `status` is an `OrderStatusKey`. Build `timeline` with the matching factory (`PENDING_TIMELINE`, `ACCEPTED_TIMELINE`, `PRINTING_TIMELINE`, `READY_TIMELINE`, `SHIPPED_TIMELINE`, `ISSUE_TIMELINE`, `DONE_TIMELINE`, `CANCELLED_TIMELINE`).
4. `createdAt` is ISO UTC and the timeline's first date is the same moment as `"YYYY-MM-DD HH:mm"`.
5. Money: `sellerPrice`, `supplierCost`, `platformFee` as numbers. A cancelled order has `platformFee: 0` (see `#0045`).

## Adding a notification
1. Append to `mockNotifications` in `src/data/mockNotifications.ts` with `role` set to the dashboard that should see it and `reason` one of `NotificationReason`.
2. `orderId` must be a real order from `mockOrders`, owned by that role's current user (`CURRENT_SELLER_ID` / `CURRENT_SUPPLIER_ID`) for seller/supplier notifications.
3. A new `reason` needs a filter entry in `NotificationsList.tsx` (`ReasonFilter` per role) and a color case in `getNotificationCardClasses` (`src/data/mockNotifications.ts`), and, if it needs actions, a branch in `NotificationDetail.tsx` (the `SUPPLIER_ASSIGNABLE` / `DISPUTE_ELIGIBLE` lists and the per-reason blocks). Read notifications through `getNotificationsByRole(role)`.

## Adding a field to an entity
1. Add it to the interface in `src/data/*.ts`. If it isn't on every record, make it optional as `field?: T | undefined` (`exactOptionalPropertyTypes`).
2. Update the role adapters that map the entity: `src/pages/dashboard/supplier/mockSupplier.ts` (`getSupplierOrders`), `src/pages/dashboard/seller/mockProducts.ts`.
3. If the field is a new status or label, it belongs in `src/constants/orderStatusConfig.ts`, not in the data file.

## Don't
- Don't create a page-local copy of records (`src/pages/dashboard/seller/mockOrders.ts` is a dead duplicate, so don't extend it).
- Don't hardcode `"SEL-001"` / `"SUP-001"` in pages. Use `src/data/currentUser.ts`.

## Verify
- `npx tsc --noEmit` (no new errors).
- Open the record in all affected roles: `/dashboard/admin/orders`, `/dashboard/seller/orders`, `/dashboard/supplier/orders`, and the order detail pages.
