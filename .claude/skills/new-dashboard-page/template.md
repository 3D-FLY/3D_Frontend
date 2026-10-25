# Dashboard page template

Copy into `src/pages/dashboard/<role>/<Role><Name>.tsx`, then replace `supplier` / `SupplierExample` / the columns.
Pattern sources: `src/pages/dashboard/admin/AdminDashboard.tsx`, `src/pages/dashboard/supplier/SupplierPayments.tsx`.

```tsx
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { ORDER_STATUS_CONFIG } from "../../../constants/orderStatusConfig.js";
import { mockOrders } from "../../../data/mockOrders.js";
import { CURRENT_SUPPLIER_ID } from "../../../data/currentUser.js";

// ─── Derived data (module level: no state dependency) ─────────────────────────
const orders = mockOrders.filter((o) => o.supplierId === CURRENT_SUPPLIER_ID);

const statCards = [
  { count: orders.length, label: "Total Orders", accentColor: "green" as const },
  {
    count: orders.filter((o) => o.status === "issue").length,
    label: ORDER_STATUS_CONFIG.issue.label,
    accentColor: ORDER_STATUS_CONFIG.issue.accentColor,
  },
];

const COLUMNS = [
  { key: "order",  header: "Order"  },
  { key: "status", header: "Status" },
  { key: "date",   header: "Date"   },
  { key: "arrow",  header: ""       },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SupplierExample() {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="supplier">
      <DashboardPage title="Example">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatusBadge key={card.label} count={card.count} label={card.label} accentColor={card.accentColor} />
          ))}
        </div>

        <DashboardCard index={0} title="Recent Orders" autoHeight viewAllTo="/dashboard/supplier/orders">
          <DashboardTable
            variant="list"
            columns={COLUMNS}
            gridTemplateColumns="1fr 1.2fr 1fr 24px"
            rows={orders}
            getRowKey={(o) => o.id}
            onRowClick={(o) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
            renderCell={(o, key) => {
              switch (key) {
                case "order":  return <span className="font-semibold text-zinc-100">{o.id}</span>;
                case "status": return <OrderStatusPill status={o.status} />;
                case "date":   return <span className="text-[11px] text-zinc-300">{formatDate(o.createdAt)}</span>;
                case "arrow":  return <span className="text-sm text-zinc-300">→</span>;
                default:       return null;
              }
            }}
          />
        </DashboardCard>
      </DashboardPage>
    </DashboardLayout>
  );
}
```

Route (in `src/App.jsx`, above `/dashboard/supplier/*`):
```jsx
const SupplierExamplePage = lazy(() => import("./pages/dashboard/supplier/SupplierExample.tsx"));
// ...
<Route
  path="/dashboard/supplier/example"
  element={
    <Suspense fallback={<LoadingPage />}>
      <SupplierExamplePage />
    </Suspense>
  }
/>
```

Sidebar (in `src/features/dashboard/components/Sidebar.tsx`, `supplierItems`):
```ts
{ label: "Example", to: "/dashboard/supplier/example", icon: FileText },
```
