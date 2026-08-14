import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../DashboardLayout.js";
import DashboardCard from "./DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "./DashboardPage.js";
import {
  getAlertsByRole,
  markAlertsSeen,
  type AlertReason,
  type AlertStatus,
} from "../../../data/mockAlerts.js";
import AlertListItem from "./AlertListItem.js";
import type { SidebarRole } from "./Sidebar.js";

const STATUS_FILTERS: { key: "all" | AlertStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

type ReasonFilter = { key: string; label: string; reasons?: AlertReason[] };

const REASON_FILTERS_BY_ROLE: Record<SidebarRole, ReasonFilter[]> = {
  admin: [
    { key: "all", label: "All Types" },
    { key: "supplier", label: "Supplier", reasons: ["supplier_rejected", "no_supplier"] },
    { key: "shipping", label: "Shipping", reasons: ["shipping_issue"] },
    { key: "missing_data", label: "Missing Data", reasons: ["missing_data"] },
    { key: "dispute", label: "Dispute", reasons: ["dispute_opened"] },
  ],
  seller: [
    { key: "all", label: "All Types" },
    { key: "supplier", label: "Supplier", reasons: ["supplier_rejected", "no_supplier"] },
    { key: "shipping", label: "Shipping", reasons: ["shipping_issue"] },
    { key: "missing_data", label: "Missing Data", reasons: ["missing_data"] },
    { key: "dispute", label: "Dispute", reasons: ["dispute_opened"] },
  ],
  supplier: [
    { key: "all", label: "All Types" },
    { key: "new_order", label: "New Order", reasons: ["new_order"] },
    { key: "deadline", label: "Deadline", reasons: ["deadline_soon"] },
    { key: "dispute", label: "Dispute", reasons: ["dispute_opened"] },
    { key: "payment", label: "Payment", reasons: ["payment_received"] },
    { key: "cancelled", label: "Cancelled", reasons: ["order_cancelled"] },
  ],
};

interface AlertsListProps {
  role: SidebarRole;
}

export default function AlertsList({ role }: AlertsListProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AlertStatus>("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const reasonFilters = REASON_FILTERS_BY_ROLE[role];

  // Mark this role's alerts as seen — clears the navbar bell badge.
  useEffect(() => {
    markAlertsSeen(role);
  }, [role]);

  const alerts = useMemo(() => getAlertsByRole(role), [role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const reasonGroup = reasonFilters.find((r) => r.key === reasonFilter);
    return alerts.filter((a) => {
      const matchSearch =
        !q || a.orderId.toLowerCase().includes(q) || a.title.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchReason = !reasonGroup?.reasons || reasonGroup.reasons.includes(a.reason);
      return matchSearch && matchStatus && matchReason;
    });
  }, [alerts, search, statusFilter, reasonFilter, reasonFilters]);

  return (
    <DashboardLayout role={role}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage
          header={
            <div className="flex items-center gap-3">
              <DashboardPageTitle>ALERTS</DashboardPageTitle>
              <span className="rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-0.5 text-[13px] font-bold text-green-500">
                {filtered.length}
              </span>
            </div>
          }
        >
          {/* ── Filters ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map(({ key, label }) => {
                  const isActive = statusFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatusFilter(key)}
                      className={[
                        "relative rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                        isActive
                          ? "text-green-500"
                          : "border border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={`${role}-alerts-status-pill`}
                          className="absolute inset-0 rounded-full border border-green-500/40 bg-green-500/15"
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {reasonFilters.map(({ key, label }) => {
                  const isActive = reasonFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setReasonFilter(key)}
                      className={[
                        "relative rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                        isActive
                          ? "text-white"
                          : "border border-white/10 bg-transparent text-zinc-500 hover:border-white/20 hover:text-zinc-300",
                      ].join(" ")}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={`${role}-alerts-reason-pill`}
                          className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order # or alert title…"
              className="w-full max-w-[420px] rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-green-500"
            />
          </div>

          {/* ── List ────────────────────────────────────────────────────── */}
          <DashboardCard title="ALL ALERTS" autoHeight>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No alerts found.</p>
            ) : (
              <div className="flex w-full flex-col">
                {filtered.map((alert) => (
                  <AlertListItem
                    key={alert.id}
                    orderId={alert.orderId}
                    title={alert.title}
                    description={alert.description}
                    reason={alert.reason}
                    status={alert.status}
                    onClick={() => navigate(`/dashboard/${role}/alerts/${alert.id}`)}
                  />
                ))}
              </div>
            )}
          </DashboardCard>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
