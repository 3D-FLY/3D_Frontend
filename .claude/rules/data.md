---
paths:
  - "src/data/**"
  - "src/constants/**"
  - "src/pages/dashboard/**/mock*.ts"
---

# Mock data and constants

## Canonical sources (src/data/): one dataset shared by all three roles
| File | Exports | ID format |
|---|---|---|
| `mockSellers.ts` | `Seller`, `mockSellers`, `getSellerById` | `SEL-001` |
| `mockSuppliers.ts` | `Supplier`, `mockSuppliers`, `getSupplierById` | `SUP-001`. `coordinates` are **`[lng, lat]`** |
| `mockProducts.ts` | `Product`, `ProductVariant`, `PrintSettings`, `mockProducts`, `getProductById`, `getProductsBySellerId` | `${sellerId}-PRD-001`, generated per seller by `makeProductsForSeller` |
| `mockOrders.ts` | `Order`, `TimelineStep`, `mockOrders`, `getOrdersByProductId`, `updateOrderStatus` | `"#0041"` (with `#`, 4 digits) |
| `mockNotifications.ts` | `Notification`, `NotificationReason`, `NotificationStatus`, `NotificationRole`, `mockNotifications`, `getNotificationsByRole`, `getNotificationCardClasses`, `NOTIFICATION_*` label/color maps, `markNotificationsSeen` | `a1…`, each with `role` and `orderId` |
| `currentUser.ts` | `CURRENT_SELLER_ID = "SEL-001"`, `CURRENT_SUPPLIER_ID = "SUP-001"` | |

## Rules
- **Every entity referenced by another must exist.** An order's `sellerId`, `supplierId`, and `productId` must match real records, and the product's `sellerId` must equal the order's `sellerId`. Admin, seller, and supplier views all read the same orders, so a broken link shows up in all three.
- "Current user" filtering goes through `currentUser.ts` constants (`mockOrders.filter((o) => o.supplierId === CURRENT_SUPPLIER_ID)` in `src/pages/dashboard/supplier/SupplierPayments.tsx`). Never hardcode `"SEL-001"` in a page.
- Money fields on `Order`: `sellerPrice`, `supplierCost`, `platformFee` (plain numbers, USD). Supplier earnings = `supplierCost * quantity` (`SupplierPayments.tsx`, `mockSupplier.ts`).
- Dates: `createdAt` is ISO UTC (`"2025-05-12T09:14:00Z"`). Timeline dates are `"YYYY-MM-DD HH:mm"`. Notification `date` is `"YYYY-MM-DD"`. Display through `toLocaleDateString("en-GB", …)` (`formatDate` in `AdminDashboard.tsx`).
- Order timelines are built with the helper factories in `mockOrders.ts` (`PRINTING_TIMELINE`, `SHIPPED_TIMELINE`, `DONE_TIMELINE`, …). Pick the one matching `status` and don't hand-write steps.
- Use the getters (`getSellerById`, `getSupplierById`, `getProductById`, `getNotificationsByRole`) instead of re-writing `.find`/`.filter` where one exists. Notification status/reason labels and colors come from the `NOTIFICATION_*` maps in `mockNotifications.ts`.
- Mutations are in-memory helpers on the shared array (`updateOrderStatus`). There's no persistence layer.

## Role adapters (view models)
When a role needs a different shape, write a **derive-only adapter** next to the pages. It maps from `src/data` and never holds its own copy of the records:
- `src/pages/dashboard/supplier/mockSupplier.ts` → `getSupplierOrders()` maps `mockOrders` + `mockProducts` into `SupplierOrder` (and keeps `storeName` hidden from supplier UI).
- `src/pages/dashboard/seller/mockProducts.ts` maps shared products into the seller `Product` form shape.
Data with no shared entity behind it (a revenue time series, payout history) lives in the role's adapter file as plain mock arrays (`mockSupplierRevenue`, `mockSupplierPayments` in `mockSupplier.ts`). Any order IDs it references must still be real.
Small page-level maps are fine inline (see `INITIAL_SUPPLIERS` in `src/pages/dashboard/admin/SuppliersPage.jsx`).

## Order status
- **Single source of truth: `src/constants/orderStatusConfig.ts`**: `ORDER_STATUS_KEYS`, `OrderStatusKey`, `ORDER_STATUS_CONFIG` (label + Tailwind classes + `accentColor`), `getStatusConfig`, `SUPPLIER_EDITABLE_STATUS_KEYS`.
- Keys: `pending, accepted, in_production, ready, shipped, delivered, issue, cancelled`. Labels differ from keys (`in_production` → "Printing", `delivered` → "DONE"). Always show `ORDER_STATUS_CONFIG[k].label`, never the key.
- Import from `orderStatusConfig.js` directly (all importers but one do). `constants/orderStatus.ts` is a re-export barrel with a single importer (`seller/OrderDetail.tsx`). Open question: keep it or remove it.

## Open questions
- `src/pages/dashboard/seller/mockOrders.ts` has no importers, so it duplicates `src/data/mockOrders.ts` as dead code. Don't extend it.
- Admin notification `orderId`s (`#3005`, `#3007`, `#3009`, `#3012`, `#3015`) don't match any order in `mockOrders` (`#0032…#0047`). Seller/supplier notifications reference real orders.
- `mockSupplierPayments` lists `#0037`, which belongs to `SUP-002`, not the current supplier `SUP-001`. Its `amount` values are hand-typed strings instead of being derived from `supplierCost * quantity`.
- `AdminDashboard.tsx` hardcodes "Welcome, Raz" instead of deriving it from a current-user record (there's no `CURRENT_ADMIN`).
