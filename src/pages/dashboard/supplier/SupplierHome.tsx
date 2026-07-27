import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import {
  mockSupplierOrders,
  SUPPLIER_STATUS_LABEL,
  SUPPLIER_STATUS_COLOR,
  type SupplierOrder,
} from "./mockSupplier.js";

function formatDeadline(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function SupplierStatusBadge({ status }: { status: SupplierOrder["status"] }) {
  const color = SUPPLIER_STATUS_COLOR[status];
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {SUPPLIER_STATUS_LABEL[status]}
    </span>
  );
}

const PROPOSED_COLUMNS = [
  { key: "product", header: "Product" },
  { key: "tech", header: "Tech" },
  { key: "color", header: "Color" },
  { key: "qty", header: "Qty" },
  { key: "deadline", header: "Deadline" },
  { key: "payment", header: "Payment" },
  { key: "actions", header: "" },
];

const ACTIVE_COLUMNS = [
  { key: "product", header: "Product" },
  { key: "status", header: "Status" },
  { key: "deadline", header: "Deadline" },
  { key: "action", header: "" },
];

export default function SupplierHome() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SupplierOrder[]>(mockSupplierOrders);

  const proposed = useMemo(() => orders.filter((o) => o.status === "proposed"), [orders]);
  const active = useMemo(
    () => orders.filter((o) => o.status === "accepted" || o.status === "printing"),
    [orders],
  );
  const revenueThisMonth = useMemo(
    () => orders.filter((o) => o.status !== "cancelled" && o.status !== "proposed").reduce((s, o) => s + o.payment, 0),
    [orders],
  );

  const handleAccept = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "accepted" } : o)));
  };
  const handleReject = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  };

  return (
    <DashboardLayout role="supplier">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage title="Welcome, David" titleClassName="italic">
          {/* ── 1. STATUS CARDS ───────────────────────────────────────────── */}
          <div className="grid min-h-[180px] grid-cols-1 gap-6 sm:grid-cols-3">
            <StatusBadge count={proposed.length} label="Proposed" accentColor="blue" />
            <StatusBadge count={active.length} label="In Production" accentColor="green" />
            <StatusBadge count={`$${revenueThisMonth.toFixed(0)}`} label="This Month" accentColor="green" />
          </div>

          {/* ── 2. PROPOSED ORDERS ────────────────────────────────────────── */}
          <DashboardCard title="PROPOSED ORDERS" index={1} autoHeight>
            {proposed.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No pending proposals</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns="1.6fr 0.8fr 0.8fr 0.6fr 0.9fr 0.9fr 1.6fr"
                columns={PROPOSED_COLUMNS}
                rows={proposed}
                getRowKey={(o) => o.id}
                scrollable={false}
                hoverable
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "product") {
                    return <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-zinc-100">{o.productName}</span>;
                  }
                  if (key === "tech") {
                    return <span className="text-[12px] text-zinc-300">{o.tech}</span>;
                  }
                  if (key === "color") {
                    return <span className="text-[12px] text-zinc-300">{o.color}</span>;
                  }
                  if (key === "qty") {
                    return <span className="text-[12px] text-zinc-300">×{o.quantity}</span>;
                  }
                  if (key === "deadline") {
                    return <span className="text-[11px] text-zinc-300">{formatDeadline(o.deadline)}</span>;
                  }
                  if (key === "payment") {
                    return <span className="text-[12px] font-semibold text-green-500">${o.payment.toFixed(2)}</span>;
                  }
                  if (key === "actions") {
                    return (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(o.id)}
                          className="rounded-md border border-green-500/40 bg-green-500/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-green-500 transition-colors hover:bg-green-500/25"
                        >
                          Accept ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(o.id)}
                          className="rounded-md border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-400/20"
                        >
                          Reject ✗
                        </button>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            )}
          </DashboardCard>

          {/* ── 3. IN PRODUCTION ──────────────────────────────────────────── */}
          <DashboardCard title="IN PRODUCTION" index={2} autoHeight>
            {active.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No active orders</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns="2fr 1.1fr 1fr 32px"
                columns={ACTIVE_COLUMNS}
                rows={active}
                getRowKey={(o) => o.id}
                scrollable={false}
                hoverable
                onRowClick={(o: SupplierOrder) => navigate(`/dashboard/supplier/orders/${o.id.replace("#", "")}`)}
                renderCell={(o: SupplierOrder, key) => {
                  if (key === "product") {
                    return <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-zinc-100">{o.productName}</span>;
                  }
                  if (key === "status") {
                    return <SupplierStatusBadge status={o.status} />;
                  }
                  if (key === "deadline") {
                    return <span className="text-[11px] text-zinc-300">{formatDeadline(o.deadline)}</span>;
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
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
