import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import { getSupplierOrders, type SupplierOrder } from "./mockSupplier.js";
import { ORDER_STATUS_CONFIG } from "../../../constants/orderStatusConfig.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { updateOrderStatus } from "../../../data/mockOrders.js";
import { getNotificationsByRole, getNotificationCardClasses } from "../../../data/mockNotifications.js";
import ScrollableContent from "../../../features/dashboard/components/ScrollableContent.js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatDeadline(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  }  );
}

const PROPOSED_COLUMNS = [
  { key: "id",        header: "Order #"    },
  { key: "product",   header: "Product"    },
  { key: "tech",      header: "Tech"       },
  { key: "material",  header: "Material"   },
  { key: "color",     header: "Color"      },
  { key: "qty",       header: "Qty"        },
  { key: "date",      header: "Date & Time"},
  { key: "dest",      header: "Destination"},
  { key: "payment",   header: "Revenue"    },
  { key: "action",    header: ""           },
];

const ACTIVE_COLUMNS = [
  { key: "id",       header: "Order #"      },
  { key: "product",  header: "Product"      },
  { key: "status",   header: "Status"       },
  { key: "date",     header: "Received"     },
  { key: "dest",     header: "Destination"  },
  { key: "action",   header: ""             },
];

export default function SupplierHome() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SupplierOrder[]>(() => getSupplierOrders());

  const pending = useMemo(() => orders.filter((o) => o.status === "pending"), [orders]);
  const active = useMemo(
    () => orders.filter((o) => o.status === "accepted" || o.status === "in_production"),
    [orders],
  );
  const revenueThisMonth = useMemo(
    () => orders.filter((o) => o.status !== "cancelled" && o.status !== "pending").reduce((s, o) => s + o.payment, 0),
    [orders],
  );

  const handleAccept = (id: string) => {
    updateOrderStatus(id, "accepted");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "accepted" } : o)));
  };
  const handleReject = (id: string) => {
    updateOrderStatus(id, "cancelled");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  };

  const supplierNotifications = getNotificationsByRole("supplier").slice(0, 5);

  const revenueChartData = [
    { month: "Jan", revenue: 320 },
    { month: "Feb", revenue: 410 },
    { month: "Mar", revenue: 380 },
    { month: "Apr", revenue: 520 },
    { month: "May", revenue: 610 },
    { month: "Jun", revenue: revenueThisMonth },
  ];

  return (
    <DashboardLayout role="supplier">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage>
          {/* ── 1. STATUS CARDS ───────────────────────────────────────────── */}
          <div className="grid min-h-[180px] grid-cols-1 gap-6 sm:grid-cols-3">
            <StatusBadge count={pending.length} label={ORDER_STATUS_CONFIG.pending.label} accentColor={ORDER_STATUS_CONFIG.pending.accentColor} />
            <StatusBadge count={active.length} label={ORDER_STATUS_CONFIG.in_production.label} accentColor={ORDER_STATUS_CONFIG.in_production.accentColor} />
            <StatusBadge count={`$${revenueThisMonth.toFixed(0)}`} label="This Month" accentColor="green" />
          </div>

          {/* ── 2. PROPOSED ORDERS ────────────────────────────────────────── */}
          <DashboardCard title="new orders" index={1} autoHeight viewAllTo="/dashboard/supplier/orders">
            {pending.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No pending orders</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns="0.8fr 1.4fr 0.7fr 0.8fr 0.7fr 0.5fr 1.1fr 1.2fr 0.9fr 32px"
                columns={PROPOSED_COLUMNS}
                rows={pending}
                getRowKey={(o) => o.id}
                scrollable={false}
                hoverable
                onRowClick={(o: SupplierOrder) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "id") {
                    return <span className="text-[12px] font-mono text-zinc-400">{o.id}</span>;
                  }
                  if (key === "product") {
                    return <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-zinc-100">{o.productName}</span>;
                  }
                  if (key === "tech") {
                    return <span className="text-[12px] text-zinc-300">{o.tech}</span>;
                  }
                  if (key === "material") {
                    return <span className="text-[12px] text-zinc-300">{o.material}</span>;
                  }
                  if (key === "color") {
                    return (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-white/40"
                          style={{ backgroundColor: o.colorHex }}
                        />
                        <span className="text-[12px] text-zinc-300">{o.color}</span>
                      </div>
                    );
                  }
                  if (key === "qty") {
                    return <span className="text-[12px] text-zinc-300">×{o.quantity}</span>;
                  }
                  if (key === "date") {
                    return (
                      <span className="text-[11px] text-zinc-300">
                        {new Date(o.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        {" "}
                        {new Date(o.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    );
                  }
                  if (key === "dest") {
                    const parts = o.shippingAddress.split(",");
                    const city = parts[1]?.trim() ?? parts[0]?.trim() ?? "—";
                    return <span className="truncate text-[12px] text-zinc-300">{city}</span>;
                  }
                  if (key === "payment") {
                    return <span className="text-[12px] font-semibold text-green-500">${o.payment.toFixed(2)}</span>;
                  }
                  if (key === "action") {
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-green-500/10 hover:text-green-500"
                        title="View order"
                      >
                        →
                      </button>
                    );
                  }
                  return null;
                }}
              />
            )}
          </DashboardCard>

          {/* ── 3. IN PRODUCTION ──────────────────────────────────────────── */}
          <DashboardCard title="IN PRODUCTION" index={2} autoHeight viewAllTo="/dashboard/supplier/orders">
            {active.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No active orders</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns="0.8fr 1.6fr 1.1fr 1fr 1.2fr 32px"
                columns={ACTIVE_COLUMNS}
                rows={active}
                getRowKey={(o) => o.id}
                scrollable={false}
                hoverable
                onRowClick={(o: SupplierOrder) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "id") {
                    return <span className="text-[12px] font-mono text-zinc-400">{o.id}</span>;
                  }
                  if (key === "product") {
                    return <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-zinc-100">{o.productName}</span>;
                  }
                  if (key === "status") {
                    return <OrderStatusPill status={o.status} />;
                  }
                  if (key === "date") {
                    return (
                      <span className="text-[11px] text-zinc-300">
                        {new Date(o.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </span>
                    );
                  }
                  if (key === "dest") {
                    const parts = o.shippingAddress.split(",");
                    const city = parts[1]?.trim() ?? parts[0]?.trim() ?? "—";
                    return <span className="truncate text-[12px] text-zinc-300">{city}</span>;
                  }
                  if (key === "action") {
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-green-500/10 hover:text-green-500"
                        title="View order"
                      >
                        →
                      </button>
                    );
                  }
                  return null;
                }}
              />
            )}
          </DashboardCard>

          {/* ── 4. NOTIFICATIONS + REVENUE ───────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Notifications */}
            <DashboardCard title="NOTIFICATIONS" index={3} autoHeight className="h-full" viewAllTo="/dashboard/supplier/notifications">
              <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                <ScrollableContent scrollbarSide="left">
                  {supplierNotifications.length === 0 ? (
                    <p className="py-6 text-center text-sm text-zinc-500">No notifications</p>
                  ) : (
                    supplierNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => navigate(`/dashboard/supplier/notifications/${notification.id}`)}
                        className={getNotificationCardClasses(notification.reason)}
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-[clamp(13px,1vw,14.5px)] font-semibold uppercase tracking-wide text-zinc-100">
                            {notification.orderId} — {notification.title}
                          </span>
                          <span className="truncate text-[11px] text-zinc-300">{notification.description}</span>
                        </div>
                        <span className="shrink-0 text-sm text-zinc-300">→</span>
                      </div>
                    ))
                  )}
                </ScrollableContent>
              </div>
            </DashboardCard>

            {/* Revenue Chart */}
            <DashboardCard title="Revenues by date" index={4} autoHeight className="h-full" viewAllTo="/dashboard/supplier/revenue">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueChartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{ background: "#0d1a10", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "white", fontSize: 12, fontWeight: 600 }}
                    formatter={(value) => [`$${value}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#5ac422"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </DashboardCard>

          </div>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
