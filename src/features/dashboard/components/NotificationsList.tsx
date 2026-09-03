import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../DashboardLayout.js";
import DashboardCard from "./DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "./DashboardPage.js";
import {
  getNotificationsByRole,
  markNotificationsSeen,
  type NotificationReason,
} from "../../../data/mockNotifications.js";
import NotificationListItem from "./NotificationListItem.js";
import type { SidebarRole } from "./Sidebar.js";
import { roleInboxPath } from "./Sidebar.js";

type ReasonFilter = { key: string; label: string; reasons?: NotificationReason[] };

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
    { key: "new_order", label: "Order received", reasons: ["new_order"] },
    { key: "deadline", label: "Deadline", reasons: ["deadline_soon"] },
    { key: "dispute", label: "Dispute", reasons: ["dispute_opened"] },
    { key: "payment", label: "Payment", reasons: ["payment_received"] },
    { key: "cancelled", label: "Cancelled", reasons: ["order_cancelled"] },
  ],
};

interface NotificationsListProps {
  role: SidebarRole;
}

export default function NotificationsList({ role }: NotificationsListProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const reasonFilters = REASON_FILTERS_BY_ROLE[role];

  // Mark this role's notifications as seen — clears the navbar bell badge.
  useEffect(() => {
    markNotificationsSeen(role);
  }, [role]);

  const notifications = useMemo(() => getNotificationsByRole(role), [role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const reasonGroup = reasonFilters.find((r) => r.key === reasonFilter);
    return notifications.filter((a) => {
      const matchSearch =
        !q || a.orderId.toLowerCase().includes(q) || a.title.toLowerCase().includes(q);
      const matchReason = !reasonGroup?.reasons || reasonGroup.reasons.includes(a.reason);
      return matchSearch && matchReason;
    });
  }, [notifications, search, reasonFilter, reasonFilters]);

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
              <DashboardPageTitle>NOTIFICATIONS</DashboardPageTitle>
              <span className="rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-0.5 text-[13px] font-bold text-green-500">
                {filtered.length}
              </span>
            </div>
          }
        >
          {/* ── Filters ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
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
                        layoutId={`${role}-notifications-reason-pill`}
                        className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
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
              placeholder="Search by order # or notification title…"
              className="w-full max-w-[420px] rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-green-500"
            />
          </div>

          {/* ── List ────────────────────────────────────────────────────── */}
          <DashboardCard title="ALL NOTIFICATIONS" autoHeight>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">
                No notifications found.
              </p>
            ) : (
              <div className="flex w-full flex-col">
                {filtered.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    orderId={notification.orderId}
                    title={notification.title}
                    description={notification.description}
                    reason={notification.reason}
                    onClick={() => navigate(roleInboxPath(role, notification.id))}
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
