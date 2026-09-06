import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { X, Package, MapPin, Truck, AlertTriangle, User, Store } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { ORDER_STATUS_CONFIG as STATUS_CONFIG, ORDER_STATUS_KEYS } from "../../../constants/orderStatusConfig.js";
import { mockOrders as sharedOrders } from "../../../data/mockOrders.js";
import { mockSellers } from "../../../data/mockSellers.js";
import { mockSuppliers } from "../../../data/mockSuppliers.js";
import { mockProducts } from "../../../data/mockProducts.js";

// ─── Status config ────────────────────────────────────────────────────────────

const ALL_STATUSES = ORDER_STATUS_KEYS.filter((s) => s !== "delivered");

// ─── Mock data ────────────────────────────────────────────────────────────────

function buildOrderRow(o) {
  const seller = mockSellers.find((s) => s.id === o.sellerId);
  const supplier = mockSuppliers.find((s) => s.id === o.supplierId);
  const product = mockProducts.find((p) => p.id === o.productId);

  return {
    id: o.id.replace("#", ""),
    orderId: o.id.replace("#", ""),
    store: seller?.name ?? "Unknown",
    status: o.status,
    date: o.createdAt,
    customer: "Unknown",
    email: "Unknown",
    phone: "Unknown",
    address: `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.country}`,
    total: `$${(o.sellerPrice * o.quantity).toFixed(2)}`,
    supplier: supplier?.name ?? null,
    tracking: null,
    issue:
      o.status === "issue"
        ? { type: "shipping_issue", detail: "There is an issue with this order that requires attention." }
        : null,
    items: [
      {
        name: product?.name ?? "Unknown",
        material: o.material,
        color: o.colorName,
        qty: o.quantity,
        unitPrice: `$${o.sellerPrice.toFixed(2)}`,
      },
    ],
  };
}

const ORDERS = sharedOrders.map(buildOrderRow);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ISSUE_TYPE_LABEL = {
  supplier_rejected: "Supplier Rejected",
  shipping_issue:    "Shipping Issue",
  missing_data:      "Missing Data",
  no_supplier:       "No Supplier Found",
  production_delay:  "Production Delay",
};

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-1">
      {children}
    </p>
  );
}

// ─── Order detail modal ───────────────────────────────────────────────────────

function OrderModal({ order, onClose }) {
  const cfg = STATUS_CONFIG[order.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(149,149,149,0.08)] backdrop-blur-[12px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[rgba(5,10,7,0.97)] shadow-2xl flex flex-col max-h-[90vh]"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-white tracking-wide">
              Order #{order.orderId}
            </span>
            <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.text} ${cfg.border} ${cfg.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#5ac422 transparent" }}
        >

          {/* Issue banner */}
          {order.issue && (
            <div className="flex gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4">
              <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-400">
                  {ISSUE_TYPE_LABEL[order.issue.type] ?? "Issue"}
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed">{order.issue.detail}</p>
              </div>
            </div>
          )}

          {/* Customer + address row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <User size={14} />
                <SectionLabel>Customer</SectionLabel>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">{order.customer}</span>
                <span className="text-[12px] text-zinc-400">{order.email}</span>
                <span className="text-[12px] text-zinc-400">{order.phone}</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin size={14} />
                <SectionLabel>Shipping Address</SectionLabel>
              </div>
              <span className="text-sm text-zinc-200 leading-relaxed">{order.address}</span>
            </div>
          </div>

          {/* Supplier + tracking row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Store size={14} />
                <SectionLabel>Supplier</SectionLabel>
              </div>
              {order.supplier ? (
                <span className="text-sm font-semibold text-white">{order.supplier}</span>
              ) : (
                <span className="text-sm text-zinc-500 italic">Not assigned yet</span>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Truck size={14} />
                <SectionLabel>Tracking</SectionLabel>
              </div>
              {order.tracking ? (
                <span className="text-sm font-mono font-semibold text-[#5ac422]">{order.tracking}</span>
              ) : (
                <span className="text-sm text-zinc-500 italic">No tracking yet</span>
              )}
            </div>
          </div>

          {/* Products table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Package size={14} />
              <SectionLabel>Items</SectionLabel>
            </div>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_0.7fr_0.8fr] gap-3 px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                {["Product", "Material", "Color", "Qty", "Unit Price"].map((h) => (
                  <span key={h} className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                    {h}
                  </span>
                ))}
              </div>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[2fr_1fr_1fr_0.7fr_0.8fr] gap-3 items-center px-4 py-3 ${
                    i < order.items.length - 1 ? "border-b border-white/[0.07]" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-white truncate">{item.name}</span>
                  <span className="text-[12px] text-zinc-300">{item.material}</span>
                  <span className="text-[12px] text-zinc-300">{item.color}</span>
                  <span className="text-[12px] font-semibold text-zinc-100">×{item.qty}</span>
                  <span className="text-[12px] font-semibold text-[#5ac422]">{item.unitPrice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer row — date + total */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-[12px] text-zinc-500">
              Placed: {formatDateTime(order.date)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-zinc-400 uppercase tracking-wide">Total</span>
              <span className="text-lg font-extrabold text-[#5ac422]">{order.total}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("order");
    if (!orderId) return;
    const found = ORDERS.find((o) => o.orderId === orderId);
    if (found) setSelected(found);
  }, [searchParams]);

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
            <span className="rounded-full bg-[#5ac422]/15 border border-[#5ac422]/30 px-2.5 py-0.5 text-[13px] font-bold text-[#5ac422]">
              {filtered.length}
            </span>
          </div>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {["all", ...ALL_STATUSES].map((s) => {
              const isActive = statusFilter === s;
              const label = s === "all" ? "All" : STATUS_CONFIG[s].label;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={[
                    "relative rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                    isActive
                      ? "text-[#5ac422]"
                      : "border border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-orders-active-pill"
                      className="absolute inset-0 rounded-full border border-[#5ac422]/40 bg-[#5ac422]/15"
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
            className="min-w-[200px] flex-1 rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-[#5ac422]"
          />
        </div>

        {/* Table */}
        <DashboardCard title="All Orders" autoHeight>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">No orders found.</p>
          ) : (
            <DashboardTable
              variant="list"
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
              onRowClick={setSelected}
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
                    <span className="text-[clamp(12px,1vw,14px)] font-semibold text-[#5ac422]">
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
                        setSelected(order);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-[#5ac422]/10 hover:text-[#5ac422]"
                      title="View details"
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

        {/* Past Orders — everything marked DONE */}
        <DashboardCard title="Print History" autoHeight>
          {pastOrders.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">No past orders yet.</p>
          ) : (
            <DashboardTable
              variant="list"
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
              onRowClick={setSelected}
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
                    <span className="text-[clamp(12px,1vw,14px)] font-semibold text-[#5ac422]">
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
                        setSelected(order);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-[#5ac422]/10 hover:text-[#5ac422]"
                      title="View details"
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
      </DashboardPage>

      <AnimatePresence>
        {selected && (
          <OrderModal key="order-modal" order={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
