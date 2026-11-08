import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { ORDER_STATUS_CONFIG as STATUS_CONFIG, ORDER_STATUS_KEYS } from "../../../constants/orderStatusConfig.js";
import OrdersListMobile from "./OrdersListMobile.js";
import { ADMIN_ORDERS as ORDERS, adminOrderPath, formatDate } from "./adminOrders.js";

// ─── Status config ────────────────────────────────────────────────────────────

const ALL_STATUSES = ORDER_STATUS_KEYS.filter((s) => s !== "delivered");

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");

  const openOrder = (order) => navigate(adminOrderPath(order.orderId));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((o) => {
      const matchSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.store.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus && o.status !== "delivered";
    });
  }, [search, statusFilter]);

  const pastOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((o) => {
      const matchSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.store.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q);
      return matchSearch && o.status === "delivered";
    });
  }, [search]);

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center gap-3">
            <DashboardPageTitle>Orders</DashboardPageTitle>
            <span className="rounded-full bg-green-500/15 border border-green-500/30 px-2.5 py-0.5 text-[13px] font-bold text-green-500">
              {filtered.length}
            </span>
          </div>
        }
      >
        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
          <div className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {["all", ...ALL_STATUSES].map((s) => {
              const isActive = statusFilter === s;
              const label = s === "all" ? "All" : STATUS_CONFIG[s].label;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={[
                    "relative shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                    isActive
                      ? "text-green-500"
                      : "border border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-orders-active-pill"
                      className="absolute inset-0 rounded-full border border-green-500/40 bg-green-500/15"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, store, or customer…"
            className="w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-green-500 md:min-w-[200px] md:flex-1 md:w-auto"
          />
        </div>

        {/* Table */}
        <DashboardCard title="All Orders" autoHeight bareOnMobile>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">No orders found.</p>
          ) : (
            <>
              <OrdersListMobile orders={filtered} onSelect={openOrder} className="md:hidden" />
              <div className="hidden md:block">
                <DashboardTable
                  variant="list"
                  animateRows
                  gridTemplateColumns="0.8fr 1.4fr 1.4fr 1.2fr 1fr 0.8fr 32px"
                  columns={[
                    { key: "order", header: "Order" },
                    { key: "customer", header: "Customer" },
                    { key: "store", header: "Store" },
                    { key: "status", header: "Status" },
                    { key: "date", header: "Date" },
                    { key: "total", header: "Total" },
                    { key: "action", header: "" },
                  ]}
                  rows={filtered}
                  getRowKey={(order) => order.id}
                  onRowClick={openOrder}
                  renderCell={(order, key) => {
                    if (key === "order") {
                      return (
                        <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">
                          #{order.orderId}
                        </span>
                      );
                    }
                    if (key === "customer" || key === "store") {
                      return (
                        <span className="truncate text-[clamp(12px,1vw,14px)] text-zinc-200">
                          {order[key]}
                        </span>
                      );
                    }
                    if (key === "status") return <OrderStatusPill status={order.status} />;
                    if (key === "date") {
                      return <span className="text-[11px] text-zinc-300">{formatDate(order.date)}</span>;
                    }
                    if (key === "total") {
                      return (
                        <span className="text-[clamp(12px,1vw,14px)] font-semibold text-green-500">
                          {order.total}
                        </span>
                      );
                    }
                    if (key === "action") {
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrder(order);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-green-500/10 hover:text-green-500"
                          title="View details"
                        >
                          →
                        </button>
                      );
                    }
                    return null;
                  }}
                />
              </div>
            </>
          )}
        </DashboardCard>

        {/* Past Orders — everything marked DONE */}
        <DashboardCard title="Print History" autoHeight bareOnMobile>
          {pastOrders.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">No past orders yet.</p>
          ) : (
            <>
              <OrdersListMobile
                orders={pastOrders}
                onSelect={openOrder}
                showStatus={false}
                className="md:hidden"
              />
              <div className="hidden md:block">
                <DashboardTable
                  variant="list"
                  animateRows
                  gridTemplateColumns="0.8fr 1.6fr 1fr 0.8fr 32px"
                  columns={[
                    { key: "order", header: "Order" },
                    { key: "store", header: "Store" },
                    { key: "date", header: "Date" },
                    { key: "total", header: "Total" },
                    { key: "action", header: "" },
                  ]}
                  rows={pastOrders}
                  getRowKey={(order) => order.id}
                  onRowClick={openOrder}
                  renderCell={(order, key) => {
                    if (key === "order") {
                      return (
                        <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">
                          #{order.orderId}
                        </span>
                      );
                    }
                    if (key === "store") {
                      return (
                        <span className="truncate text-[clamp(12px,1vw,14px)] text-zinc-200">
                          {order.store}
                        </span>
                      );
                    }
                    if (key === "date") {
                      return <span className="text-[11px] text-zinc-300">{formatDate(order.date)}</span>;
                    }
                    if (key === "total") {
                      return (
                        <span className="text-[clamp(12px,1vw,14px)] font-semibold text-green-500">
                          {order.total}
                        </span>
                      );
                    }
                    if (key === "action") {
                      return (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrder(order);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-green-500/10 hover:text-green-500"
                          title="View details"
                        >
                          →
                        </button>
                      );
                    }
                    return null;
                  }}
                />
              </div>
            </>
          )}
        </DashboardCard>
      </DashboardPage>
    </DashboardLayout>
  );
}
