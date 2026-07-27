import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../DashboardLayout.js";
import DashboardCard from "./DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "./DashboardPage.js";
import OrderStatusPill from "./OrderStatusPill.js";
import {
  mockAlerts,
  mockLinkedOrders,
  ALERT_STATUS_LABEL,
  ALERT_STATUS_DOT,
  ALERT_STATUS_TEXT,
  ALERT_STATUS_BORDER,
  ALERT_STATUS_BG,
  type AlertReason,
} from "../../../data/mockAlerts.js";
import type { SidebarRole } from "./Sidebar.js";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-2.5 last:border-0">
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </span>
      <div className="flex items-center gap-1.5 text-right">{children}</div>
    </div>
  );
}

const DISPUTE_ELIGIBLE: AlertReason[] = ["supplier_rejected", "shipping_issue"];
const SUPPLIER_ASSIGNABLE: AlertReason[] = ["supplier_rejected", "no_supplier"];
const SUPPLIER_DISPLAY_ONLY: AlertReason[] = ["payment_received", "order_cancelled"];

interface AlertDetailProps {
  role: SidebarRole;
}

function NotFound({ role }: { role: SidebarRole }) {
  const navigate = useNavigate();
  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-zinc-400">Alert not found.</p>
        <button
          type="button"
          onClick={() => navigate(`/dashboard/${role}/alerts`)}
          className="flex items-center gap-2 text-sm text-green-500 hover:underline"
        >
          <ArrowLeft size={15} /> Back to Alerts
        </button>
      </div>
    </DashboardLayout>
  );
}

export default function AlertDetail({ role }: AlertDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const alert = mockAlerts.find((a) => a.id === id && a.role === role);

  if (!alert) {
    return <NotFound role={role} />;
  }

  const linkedOrder = mockLinkedOrders[alert.orderId];

  const fireMockAction = () => {
    setActionMsg("Action sent successfully.");
    setTimeout(() => setActionMsg(null), 2000);
  };

  const goToOrder = () => {
    const rawId = alert.orderId.replace("#", "");
    if (role === "admin") {
      navigate(`/dashboard/admin/orders?order=${rawId}`);
    } else {
      navigate(`/dashboard/${role}/orders/${rawId}`);
    }
  };

  const timelineSteps = [
    { label: "Alert Created", done: true, date: `${formatDate(alert.date)} 09:14` },
    { label: "Assigned to Team", done: true, date: `${formatDate(alert.date)} 09:20` },
    {
      label: "In Progress",
      done: alert.status === "in_progress" || alert.status === "resolved",
      active: alert.status === "in_progress",
      date: alert.status === "open" ? null : "Currently being handled",
    },
    {
      label: "Resolved",
      done: alert.status === "resolved",
      active: false,
      date: alert.status === "resolved" ? formatDate(alert.date) : null,
    },
  ];

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
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/${role}/alerts`)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                  title="Back to Alerts"
                >
                  <ArrowLeft size={18} />
                </button>
                <DashboardPageTitle className="truncate">
                  {alert.title.toUpperCase()}
                </DashboardPageTitle>
              </div>
              <span
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-bold uppercase tracking-wide ${ALERT_STATUS_TEXT[alert.status]} ${ALERT_STATUS_BORDER[alert.status]} ${ALERT_STATUS_BG[alert.status]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${ALERT_STATUS_DOT[alert.status]}`} />
                {ALERT_STATUS_LABEL[alert.status]}
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <DashboardCard index={0} title="ALERT DETAILS" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <InfoRow label="ORDER #">
                    <span className="font-mono text-[13px] text-zinc-200">{alert.orderId}</span>
                  </InfoRow>
                  <InfoRow label="TYPE">
                    <span className="text-[13px] text-zinc-200">{alert.title}</span>
                  </InfoRow>
                  <InfoRow label="DATE">
                    <span className="text-[13px] text-zinc-200">{formatDate(alert.date)}</span>
                  </InfoRow>
                  <InfoRow label="DESCRIPTION">
                    <span className="max-w-[280px] text-[13px] leading-relaxed text-zinc-200">
                      {alert.description}
                    </span>
                  </InfoRow>
                </div>
              </DashboardCard>

              <DashboardCard index={1} title="LINKED ORDER" autoHeight withBackground={false}>
                {linkedOrder ? (
                  <div className="flex flex-col">
                    <InfoRow label="PRODUCT">
                      <span className="text-[13px] text-zinc-200">{linkedOrder.product}</span>
                    </InfoRow>
                    <InfoRow label="SUPPLIER">
                      <span className="text-[13px] text-zinc-200">{linkedOrder.supplier}</span>
                    </InfoRow>
                    <InfoRow label="STATUS">
                      <OrderStatusPill status={linkedOrder.status} />
                    </InfoRow>
                    <InfoRow label="TOTAL">
                      <span className="text-[13px] font-semibold text-green-500">
                        ${linkedOrder.total.toFixed(2)}
                      </span>
                    </InfoRow>
                    <button
                      type="button"
                      onClick={goToOrder}
                      className="mt-4 flex items-center justify-center gap-2 self-end rounded-md border border-white/10 px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-green-500/40 hover:text-green-500"
                    >
                      View Order <span>→</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No linked order data available.</p>
                )}
              </DashboardCard>
            </div>

            {/* ─── RIGHT COLUMN ────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <DashboardCard index={2} title="ACTIONS" autoHeight withBackground={false}>
                <div className="flex flex-col gap-3">
                  {role === "admin" ? (
                    <>
                      {SUPPLIER_ASSIGNABLE.includes(alert.reason) && (
                        <button
                          type="button"
                          onClick={fireMockAction}
                          className="rounded-md bg-green-500 py-2.5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                        >
                          Assign to New Supplier
                        </button>
                      )}
                      {alert.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={fireMockAction}
                          className="rounded-md border border-green-500/40 py-2.5 text-[13px] font-bold uppercase tracking-wide text-green-500 transition-colors hover:bg-green-500/10"
                        >
                          Mark as Resolved
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={fireMockAction}
                        className="rounded-md border border-white/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                      >
                        Contact Seller
                      </button>
                      <button
                        type="button"
                        onClick={fireMockAction}
                        className="rounded-md border border-white/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                      >
                        Contact Supplier
                      </button>

                      <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                          Add Internal Note
                        </span>
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Write a note visible to admins only..."
                          rows={3}
                          className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-wider placeholder:text-white/25 transition-colors focus:border-green-500/40"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            fireMockAction();
                            setNote("");
                          }}
                          disabled={!note.trim()}
                          className="self-end rounded-md border border-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Save Note
                        </button>
                      </div>
                    </>
                  ) : role === "seller" ? (
                    <>
                      {DISPUTE_ELIGIBLE.includes(alert.reason) && (
                        <button
                          type="button"
                          onClick={fireMockAction}
                          className="rounded-md border border-yellow-400/40 py-2.5 text-[13px] font-bold uppercase tracking-wide text-yellow-400 transition-colors hover:bg-yellow-400/10"
                        >
                          Open Dispute
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={fireMockAction}
                        className="rounded-md border border-white/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                      >
                        Contact Support
                      </button>
                      <button
                        type="button"
                        onClick={goToOrder}
                        className="rounded-md border border-green-500/40 py-2.5 text-[13px] font-bold uppercase tracking-wide text-green-500 transition-colors hover:bg-green-500/10"
                      >
                        View Order
                      </button>
                    </>
                  ) : (
                    <>
                      {alert.reason === "new_order" && (
                        <>
                          <button
                            type="button"
                            onClick={fireMockAction}
                            className="rounded-md bg-green-500 py-2.5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                          >
                            Accept Order
                          </button>
                          <button
                            type="button"
                            onClick={fireMockAction}
                            className="rounded-md border border-red-400/30 bg-red-400/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-400/20"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {alert.reason === "deadline_soon" && (
                        <button
                          type="button"
                          onClick={fireMockAction}
                          className="rounded-md bg-green-500 py-2.5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {alert.reason === "dispute_opened" && (
                        <button
                          type="button"
                          onClick={fireMockAction}
                          className="rounded-md border border-white/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                        >
                          Contact Support
                        </button>
                      )}
                      {SUPPLIER_DISPLAY_ONLY.includes(alert.reason) && (
                        <p className="text-center text-[12px] text-zinc-500">No action needed for this alert.</p>
                      )}
                      <button
                        type="button"
                        onClick={goToOrder}
                        className="rounded-md border border-white/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                      >
                        View Order
                      </button>
                    </>
                  )}

                  <AnimatePresence>
                    {actionMsg && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="text-center text-[12px] font-semibold text-green-500"
                      >
                        {actionMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </DashboardCard>

              <DashboardCard index={3} title="TIMELINE" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  {timelineSteps.map((step, i) => {
                    const isLast = i === timelineSteps.length - 1;
                    const dotClass = step.done ? "bg-green-500" : step.active ? "bg-yellow-400" : "bg-zinc-700";
                    const labelClass = step.active
                      ? "text-white font-semibold"
                      : step.done
                        ? "text-zinc-400"
                        : "text-zinc-600";
                    const marker = step.done ? "✓" : step.active ? "●" : "○";
                    return (
                      <div key={step.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotClass}`} />
                          {!isLast && <div className="my-1 w-px flex-1 bg-white/10" />}
                        </div>
                        <div className="pb-4">
                          <p className={`text-[13px] ${labelClass}`}>
                            {marker} {step.label}
                          </p>
                          <p className="text-[11px] text-zinc-600">{step.date ?? "—"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>
            </div>
          </div>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
