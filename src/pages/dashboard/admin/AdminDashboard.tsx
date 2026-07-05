import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import type { OrderAttention } from "../../../features/dashboard/components/OrderAttentionList.js";
import OrderAttentionList from "../../../features/dashboard/components/OrderAttentionList.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";

const attentionOrders: OrderAttention[] = [
  { id: "1", orderId: "3012", reason: "supplier_rejected", detail: "Rejected by: Supplier A",     timestamp: new Date(Date.now() - 5  * 60000).toISOString() },
  { id: "2", orderId: "3015", reason: "no_supplier",       detail: "No match in Tel Aviv area",   timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: "3", orderId: "3009", reason: "missing_data",      detail: "Missing: print file",         timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: "4", orderId: "3007", reason: "shipping_issue",    detail: "Stuck at courier for 3 days", timestamp: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: "5", orderId: "3001", reason: "production_delay",  detail: "Supplier B — 2 days overdue", timestamp: new Date(Date.now() - 5  * 3600000).toISOString() },
];

const statusCards = [
  { count: 30125, label: "Total Orders", accentColor: "green" as const },
  { count: 57, label: "Pending Match", accentColor: "orange" as const },
  { count: 842, label: "In Production", accentColor: "blue" as const },
  { count: 37, label: "Open Issues", accentColor: "red" as const },
];

interface RecentOrder {
  id: string;
  orderId: string;
  store: string;
  status: OrderStatusKey;
  date: string;
}

const RECENT_ORDERS_COLUMNS = [
  { key: "order",  header: "Order"  },
  { key: "store",  header: "Store"  },
  { key: "status", header: "Status" },
  { key: "date",   header: "Date"   },
  { key: "arrow",  header: ""       },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const recentOrders: RecentOrder[] = [
  { id: "1",  orderId: "3015", store: "Galaxy Toys",    status: "pending",       date: new Date(Date.now() - 1  * 3600000).toISOString() },
  { id: "2",  orderId: "3014", store: "Mini World",     status: "in_production", date: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: "3",  orderId: "3013", store: "Galaxy Toys",    status: "shipped",       date: new Date(Date.now() - 5  * 3600000).toISOString() },
  { id: "4",  orderId: "3012", store: "Print & Play",   status: "issue",         date: new Date(Date.now() - 8  * 3600000).toISOString() },
  { id: "5",  orderId: "3011", store: "Mini World",     status: "delivered",     date: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "6",  orderId: "3010", store: "Galaxy Toys",    status: "shipped",       date: new Date(Date.now() - 18 * 3600000).toISOString() },
  { id: "7",  orderId: "3009", store: "Print & Play",   status: "in_production", date: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "8",  orderId: "3008", store: "Mini World",     status: "delivered",     date: new Date(Date.now() - 30 * 3600000).toISOString() },
];

const searchInputClass =
  "w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="admin">
      <DashboardPage title="Welcome, Raz">
        <DashboardCard index={0} title="Status" className="status-container">
          <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statusCards.map((card) => (
              <div key={card.label} className="h-full">
                <StatusBadge
                  count={card.count}
                  label={card.label}
                  accentColor={card.accentColor}
                  {...(card.label === "Pending Match" && { onClick: () => navigate("/admin/matching") })}
                />
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <DashboardCard index={1} title="Action Required" autoHeight className="h-full">
            <OrderAttentionList items={attentionOrders} />
          </DashboardCard>

          <div className="flex h-full min-h-0 flex-col gap-6">
            <DashboardCard index={2} title="Find an Order" autoHeight fill withBackground={false}>
              <input
                type="text"
                placeholder="Order # or customer name…"
                className={searchInputClass}
              />
            </DashboardCard>

            <DashboardCard index={3} title="Find a Supplier" autoHeight fill withBackground={false}>
              <input
                type="text"
                placeholder="Supplier name or city…"
                className={searchInputClass}
              />
            </DashboardCard>
          </div>
        </div>

        <DashboardCard
          index={4}
          title="Recent Orders"
          autoHeight
          headerAction={
            <button
              onClick={() => navigate("/dashboard/admin/orders")}
              className="text-[11px] font-bold uppercase tracking-wide text-zinc-200 hover:text-white transition-colors"
            >
              View All →
            </button>
          }
        >
          <DashboardTable
            variant="list"
            columns={RECENT_ORDERS_COLUMNS}
            gridTemplateColumns="1fr 1.5fr 1.2fr 1fr 24px"
            rows={recentOrders}
            cap={30}
            getRowKey={(o) => o.id}
            onRowClick={(o) => navigate(`/dashboard/admin/orders?order=${o.orderId}`)}
            renderCell={(o, key) => {
              switch (key) {
                case "order":  return <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">#{o.orderId}</span>;
                case "store":  return <span className="truncate text-[clamp(12px,1vw,14px)] text-zinc-200">{o.store}</span>;
                case "status": return <OrderStatusPill status={o.status} />;
                case "date":   return <span className="text-[11px] text-zinc-300">{formatDate(o.date)}</span>;
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
