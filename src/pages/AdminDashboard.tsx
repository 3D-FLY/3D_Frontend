import { useNavigate } from "react-router-dom";
import DashboardLayout from "../features/dashboard/DashboardLayout.js";
import DashboardCard from "../features/dashboard/components/DashboardCard.js";
import StatBlock from "../features/dashboard/components/StatBlock.js";
import StatusBadge from "../features/dashboard/components/StatusBadge.js";
import NotificationList from "../features/dashboard/components/NotificationList.js";
import type { Notification } from "../features/dashboard/components/NotificationList.js";
import type { OrderAttention } from "../features/dashboard/components/OrderAttentionList.js";
import OrderAttentionList from "../features/dashboard/components/OrderAttentionList.js";
import RecentOrdersTable, { type RecentOrder } from "../features/dashboard/components/RecentOrdersTable.js";

const attentionOrders: OrderAttention[] = [
  { id: "1", orderId: "3012", reason: "supplier_rejected", detail: "Rejected by: Supplier A",     timestamp: new Date(Date.now() - 5  * 60000).toISOString() },
  { id: "2", orderId: "3015", reason: "no_supplier",       detail: "No match in Tel Aviv area",   timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: "3", orderId: "3009", reason: "missing_data",      detail: "Missing: print file",         timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: "4", orderId: "3007", reason: "shipping_issue",    detail: "Stuck at courier for 3 days", timestamp: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: "5", orderId: "3001", reason: "production_delay",  detail: "Supplier B — 2 days overdue", timestamp: new Date(Date.now() - 5  * 3600000).toISOString() },
];

const topSellers = [
  { name: "Soldier", units: 48, revenue: "$2,400" },
  { name: "Spider Soldier", units: 36, revenue: "$1,800" },
  { name: "Dragon Figurine", units: 29, revenue: "$1,450" },
];

const statusCards = [
  { count: 30125, label: "Total Orders", accentColor: "green" as const },
  { count: 57, label: "Pending Match", accentColor: "orange" as const },
  { count: 842, label: "In Production", accentColor: "blue" as const },
  { count: 37, label: "Open Issues", accentColor: "red" as const },
];

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


export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="admin">
      <div className="w-full space-y-6 box-border">
        {/* Welcome */}
        <h1 className="text-[clamp(22px,2.5vw,32px)] font-semibold text-white">Welcome, Raz</h1>

        {/* Status */}
        <DashboardCard title="Status" className="status-container">
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

        {/* Notifications */}
        <DashboardCard title="Orders Needing Attention" className="attention-container" autoHeight>
          <OrderAttentionList items={attentionOrders} />
        </DashboardCard>

        <DashboardCard
          title="Recent Orders"
          autoHeight
          headerAction={
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-[11px] font-bold uppercase tracking-wide text-zinc-200 hover:text-white transition-colors"
            >
              View All →
            </button>
          }
        >
          <RecentOrdersTable items={recentOrders} />
        </DashboardCard>

          <DashboardCard title="Find an Order">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Order # or customer name…"
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-green-400 transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <StatBlock
                  value="30,125"
                  label="Total Orders"
                  accentColor="white"
                />
                <StatBlock
                  value="37"
                  label="Open Issues"
                  accentColor="yellow"
                />
              </div>
            </div>
          </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
