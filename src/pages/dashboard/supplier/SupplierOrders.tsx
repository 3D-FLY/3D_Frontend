import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import {
  mockSupplierOrders,
  SUPPLIER_STATUS_LABEL,
  SUPPLIER_STATUS_COLOR,
  type SupplierOrder,
  type SupplierOrderStatus,
} from "./mockSupplier.js";

const FILTER_STATUSES: SupplierOrderStatus[] = ["proposed", "accepted", "printing", "done", "shipped", "cancelled"];

const GRID_TEMPLATE = "2fr 1fr 1.1fr 1fr 1.2fr 32px";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SupplierStatusBadge({ status }: { status: SupplierOrderStatus }) {
  const color = SUPPLIER_STATUS_COLOR[status];
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {SUPPLIER_STATUS_LABEL[status]}
    </span>
  );
}

export default function SupplierOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SupplierOrderStatus>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockSupplierOrders.filter((o) => {
      const matchSearch =
        !q || o.id.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

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
                const label = s === "all" ? "All" : SUPPLIER_STATUS_LABEL[s];
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
          <DashboardCard title="MY ORDERS" autoHeight>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No orders found.</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns={GRID_TEMPLATE}
                columns={[
                  { key: "product", header: "Product" },
                  { key: "tech", header: "Tech" },
                  { key: "deadline", header: "Deadline" },
                  { key: "payment", header: "Payment" },
                  { key: "status", header: "Status" },
                  { key: "action", header: "" },
                ]}
                rows={filtered}
                getRowKey={(o) => o.id}
                hoverable
                scrollable={false}
                onRowClick={(o: SupplierOrder) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "product") {
                    return (
                      <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">
                        {o.productName}
                      </span>
                    );
                  }
                  if (key === "tech") {
                    return <span className="text-[12px] text-zinc-300">{o.tech}</span>;
                  }
                  if (key === "deadline") {
                    return <span className="text-[11px] text-zinc-300">{formatDate(o.deadline)}</span>;
                  }
                  if (key === "payment") {
                    return (
                      <span className="text-[clamp(12px,1vw,14px)] font-semibold text-green-500">
                        ${o.payment.toFixed(2)}
                      </span>
                    );
                  }
                  if (key === "status") {
                    return <SupplierStatusBadge status={o.status} />;
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
                        title="View order details"
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
