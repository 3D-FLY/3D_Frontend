import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import { getSupplierOrders, type SupplierOrder } from "./mockSupplier.js";
import {
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_KEYS,
  SUPPLIER_EDITABLE_STATUS_KEYS,
  getStatusConfig,
  type OrderStatusKey,
} from "../../../constants/orderStatusConfig.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { updateOrderStatus } from "../../../data/mockOrders.js";

const FILTER_STATUSES = ORDER_STATUS_KEYS.filter((s) => s !== "delivered");

const GRID_TEMPLATE = "48px 1.6fr 0.7fr 0.8fr 0.7fr 0.5fr 1.1fr 1.1fr 0.9fr 1.2fr 32px";

const PAST_ORDERS_GRID = "48px 1.8fr 1.1fr 0.9fr 32px";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_OPTIONS = SUPPLIER_EDITABLE_STATUS_KEYS;

function StatusDropdown({
  status,
  onChange,
}: {
  status: OrderStatusKey;
  onChange: (next: OrderStatusKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const placeMenu = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left });
  };

  useEffect(() => {
    if (!open) return;
    placeMenu();
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", placeMenu, true);
    window.addEventListener("resize", placeMenu);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", placeMenu, true);
      window.removeEventListener("resize", placeMenu);
    };
  }, [open]);

  const select = (s: OrderStatusKey) => {
    onChange(s);
    setOpen(false);
  };

  return (
    <div
      ref={triggerRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-1 transition-opacity hover:opacity-80"
      >
        <OrderStatusPill status={status} />
        <span className="text-[10px] opacity-50">▾</span>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-[200] min-w-[160px] rounded-xl border border-white/10 bg-[rgba(10,18,12,0.97)] py-1.5 shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map((s) => {
            const optionCfg = getStatusConfig(s);
            const isActive = s === status;
            return (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  select(s);
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-[clamp(12px,1vw,14px)] font-semibold uppercase tracking-wide transition-colors hover:bg-white/[0.06] ${optionCfg.text} ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${optionCfg.dot}`} />
                {optionCfg.label}
                {isActive && <span className="ml-auto text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

export default function SupplierOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SupplierOrder[]>(() => getSupplierOrders());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatusKey>("all");

  const handleStatusChange = (id: string, next: OrderStatusKey) => {
    updateOrderStatus(id, next);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        !q || o.id.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus && o.status !== "delivered";
    });
  }, [orders, search, statusFilter]);

  const pastOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        !q || o.id.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q);
      return matchSearch && o.status === "delivered";
    });
  }, [orders, search]);

  return (
    <DashboardLayout role="supplier">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage
          header={
            <div className="flex items-center gap-3">
              <DashboardPageTitle>ORDERS</DashboardPageTitle>
              <span className="rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-0.5 text-[13px] font-bold text-green-500">
                {filtered.length}
              </span>
            </div>
          }
        >
          {/* ── Filters ─────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {(["all", ...FILTER_STATUSES] as const).map((s) => {
                const isActive = statusFilter === s;
                const label = s === "all" ? "All" : ORDER_STATUS_CONFIG[s].label;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={[
                      "relative rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                      isActive
                        ? "text-green-500"
                        : "border border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="supplier-orders-active-pill"
                        className="absolute inset-0 rounded-full border border-green-500/40 bg-green-500/15"
                        transition={{ duration: 0.2, ease: "easeOut" }}
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
              placeholder="Search by product name or order number…"
              className="min-w-[200px] flex-1 rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-green-500"
            />
          </div>

          {/* ── Table ───────────────────────────────────────────────────── */}
          <DashboardCard title="MY ORDERS" autoHeight withBackground={false}>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No orders found.</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns={GRID_TEMPLATE}
                columns={[
                  { key: "image",    header: ""             },
                  { key: "product",  header: "Product"      },
                  { key: "tech",     header: "Tech"         },
                  { key: "material", header: "Material"     },
                  { key: "color",    header: "Color"        },
                  { key: "qty",      header: "Qty"          },
                  { key: "date",     header: "Date & Time"  },
                  { key: "dest",     header: "Destination"  },
                  { key: "payment",  header: "Revenue"      },
                  { key: "status",   header: "Status"       },
                  { key: "action",   header: ""             },
                ]}
                rows={filtered}
                getRowKey={(o) => o.id}
                hoverable
                scrollable={false}
                onRowClick={(o: SupplierOrder) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "image") {
                    return (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {o.productImage ? (
                          <img src={o.productImage} alt={o.productName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600 text-[10px] font-bold">3D</div>
                        )}
                      </div>
                    );
                  }
                  if (key === "product") {
                    return <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">{o.productName}</span>;
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
                    return <span className="text-[clamp(12px,1vw,14px)] font-semibold text-green-500">${o.payment.toFixed(2)}</span>;
                  }
                  if (key === "status") {
                    return (
                      <StatusDropdown
                        status={o.status}
                        onChange={(next) => handleStatusChange(o.id, next)}
                      />
                    );
                  }
                  if (key === "action") {
                    return (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-green-500/10 hover:text-green-500"
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

          {/* ── Past Orders — everything marked DONE ───────────────────── */}
          <DashboardCard title="PAST ORDERS" autoHeight withBackground={false}>
            {pastOrders.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No past orders yet.</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns={PAST_ORDERS_GRID}
                columns={[
                  { key: "image",   header: ""        },
                  { key: "product", header: "Product" },
                  { key: "date",    header: "Date & Time" },
                  { key: "payment", header: "Revenue" },
                  { key: "action",  header: ""        },
                ]}
                rows={pastOrders}
                getRowKey={(o) => o.id}
                hoverable
                scrollable={false}
                onRowClick={(o: SupplierOrder) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "image") {
                    return (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {o.productImage ? (
                          <img src={o.productImage} alt={o.productName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600 text-[10px] font-bold">3D</div>
                        )}
                      </div>
                    );
                  }
                  if (key === "product") {
                    return <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">{o.productName}</span>;
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
                  if (key === "payment") {
                    return <span className="text-[clamp(12px,1vw,14px)] font-semibold text-green-500">${o.payment.toFixed(2)}</span>;
                  }
                  if (key === "action") {
                    return (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-green-500/10 hover:text-green-500"
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
      </motion.div>
    </DashboardLayout>
  );
}
