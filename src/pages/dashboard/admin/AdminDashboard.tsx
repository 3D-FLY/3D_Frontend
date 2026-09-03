import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import type { OrderAttention } from "../../../features/dashboard/components/OrderAttentionList.js";
import OrderAttentionList from "../../../features/dashboard/components/OrderAttentionList.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { ORDER_STATUS_CONFIG, type OrderStatusKey } from "../../../constants/orderStatusConfig.js";
import { mockNotifications } from "../../../data/mockNotifications.js";
import { mockOrders } from "../../../data/mockOrders.js";
import { mockSellers } from "../../../data/mockSellers.js";

const attentionOrders: OrderAttention[] = mockNotifications
  .filter((a) => a.role === "admin" && a.isNew)
  .map((a) => ({
    id: a.id,
    orderId: a.orderId.replace("#", ""),
    reason: a.reason as OrderAttention["reason"],
    detail: a.description,
    timestamp: a.date,
  }));

const statusCards = [
  { count: mockOrders.length, label: "Total Orders", accentColor: "green" as const },
  { count: mockOrders.filter((o) => o.status === "pending").length, label: ORDER_STATUS_CONFIG.pending.label, accentColor: ORDER_STATUS_CONFIG.pending.accentColor },
  { count: mockOrders.filter((o) => o.status === "in_production").length, label: ORDER_STATUS_CONFIG.in_production.label, accentColor: ORDER_STATUS_CONFIG.in_production.accentColor },
  { count: mockOrders.filter((o) => o.status === "issue").length, label: ORDER_STATUS_CONFIG.issue.label, accentColor: ORDER_STATUS_CONFIG.issue.accentColor },
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

const recentOrders: RecentOrder[] = [...mockOrders]
  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  .slice(0, 8)
  .map((o) => ({
    id: o.id,
    orderId: o.id.replace("#", ""),
    store: mockSellers.find((s) => s.id === o.sellerId)?.name ?? "Unknown",
    status: o.status,
    date: o.createdAt,
  }));

const searchInputClass =
  "w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout role="admin">
      <DashboardPage title="Welcome, Raz">
        <div className="grid min-h-[180px] w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card) => (
            <StatusBadge
              key={card.label}
              count={card.count}
              label={card.label}
              accentColor={card.accentColor}
              {...(card.label === "Pending Match" && { onClick: () => navigate("/admin/matching") })}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <DashboardCard index={0} title="Notifications" autoHeight className="h-full" viewAllTo="/dashboard/admin/notifications">
            <OrderAttentionList items={attentionOrders} />
          </DashboardCard>

          <div className="flex h-full min-h-0 flex-col gap-6">
            <DashboardCard index={1} title="Find an Order" autoHeight fill withBackground={false}>
              <input
                type="text"
                placeholder="Order # or customer name…"
                className={searchInputClass}
              />
            </DashboardCard>

            <DashboardCard index={2} title="Find a Supplier" autoHeight fill withBackground={false}>
              <input
                type="text"
                placeholder="Supplier name or city…"
                className={searchInputClass}
              />
            </DashboardCard>
          </div>
        </div>

        <DashboardCard
          index={3}
          title="Recent Orders"
          autoHeight
          viewAllTo="/dashboard/admin/orders"
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
