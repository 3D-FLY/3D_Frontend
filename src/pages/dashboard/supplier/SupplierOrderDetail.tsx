import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, AlertTriangle, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import { getSupplierOrders, type SupplierOrder } from "./mockSupplier.js";
import {
  SUPPLIER_EDITABLE_STATUS_KEYS,
  getStatusConfig,
  type OrderStatusKey,
} from "../../../constants/orderStatusConfig.js";
import { updateOrderStatus } from "../../../data/mockOrders.js";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-2.5 last:border-0">
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </span>
      <span className="text-[13px] font-medium text-zinc-200">{children}</span>
    </div>
  );
}

const NEXT_ACTION: Partial<Record<OrderStatusKey, OrderStatusKey>> = {
  pending: "accepted",
  accepted: "in_production",
  in_production: "ready",
  ready: "shipped",
};

function NotFound() {
  const navigate = useNavigate();
  return (
    <DashboardLayout role="supplier">
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-zinc-400">Order not found.</p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/supplier/orders")}
          className="flex items-center gap-2 text-sm text-green-500 hover:underline"
        >
          <ArrowLeft size={15} /> Back to Orders
        </button>
      </div>
    </DashboardLayout>
  );
}

function RejectModal({
  orderId,
  onClose,
  onSubmit,
}: {
  orderId: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [sent, setSent]     = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setSent(true);
    setTimeout(onClose, 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(10,18,12,0.97)] p-6 shadow-2xl flex flex-col gap-5"
      >

        <div className="flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-400 shrink-0" />
          <h2 className="text-base font-bold uppercase tracking-widest text-white">
            Report Issue / Reject Order
          </h2>
        </div>

        {/* Order ref */}
        <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
          <span className="text-[11px] uppercase tracking-wider text-white/40">Order</span>
          <p className="mt-0.5 text-sm font-semibold text-white">{orderId}</p>
        </div>

        {/* Reason textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-white/40">
            Describe the issue
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you cannot fulfill this order..."
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-wider placeholder:text-white/25 transition-colors focus:border-red-400/40"
          />
        </div>

        {/* Contact support note */}
        <p className="text-[11px] text-white/30">
          After submitting, our support team will review this and contact you if needed.
        </p>

        {sent ? (
          <p className="text-center text-sm font-semibold text-green-500">✓ Issue reported. The admin has been notified.</p>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-white/10 py-2.5 text-sm text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="flex-1 rounded-md bg-red-500 py-2.5 text-sm font-extrabold uppercase italic tracking-wide text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Submit Issue
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SupplierOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<SupplierOrder | undefined>(
    () => getSupplierOrders().find((o) => o.id.replace("#", "") === id),
  );
  const [copied, setCopied] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen]       = useState(false);
  const [rejectReason, setRejectReason]             = useState("");
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!statusDropdownOpen) return;
    const el = statusDropdownRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    function handler(e: MouseEvent) {
      const t = e.target as Node;
      if (statusDropdownRef.current?.contains(t) || statusMenuRef.current?.contains(t)) return;
      setStatusDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [statusDropdownOpen]);

  if (!order) {
    return <NotFound />;
  }

  const ps = order.printSettings;
  const statusCfg = getStatusConfig(order.status);

  const updateStatus = (next: OrderStatusKey) => {
    updateOrderStatus(order.id, next);
    setOrder((prev) => (prev ? { ...prev, status: next } : prev));
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(order.shippingAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextAction = NEXT_ACTION[order.status];

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
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/supplier/orders")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                  title="Back to Orders"
                >
                  <ArrowLeft size={18} />
                </button>
                <DashboardPageTitle className="truncate">ORDER {order.id}</DashboardPageTitle>
              </div>
              <span
                className={`shrink-0 rounded-full border px-3 py-1 text-[12px] font-bold uppercase tracking-wide ${statusCfg.text} ${statusCfg.border} ${statusCfg.bg}`}
              >
                {statusCfg.label}
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <DashboardCard index={0} title="PRODUCT INFO" autoHeight withBackground={false}>
                <div className="flex gap-5">
                  {/* Product image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                    {order.productImage ? (
                      <img src={order.productImage} alt={order.productName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600 text-[11px] font-bold uppercase">3D</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <InfoRow label="PRODUCT">
                      <span className="text-[13px] font-semibold text-white">{order.productName}</span>
                    </InfoRow>
                    <InfoRow label="QUANTITY">
                      <span className="text-[13px] text-zinc-200">×{order.quantity}</span>
                    </InfoRow>
                    <InfoRow label="COLOR">
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-white/40"
                        style={{ backgroundColor: order.colorHex }}
                      />
                      <span className="text-[13px] text-zinc-200">{order.color}</span>
                    </InfoRow>
                    <InfoRow label="MATERIAL">
                      <span className="text-[13px] text-zinc-200">{order.material}</span>
                    </InfoRow>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard index={1} title="PRINT SETTINGS" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <SettingRow label="Tech">{ps.tech}</SettingRow>
                  <SettingRow label="Material">{ps.material}</SettingRow>
                  <SettingRow label="Layer Height">{ps.layerHeight} mm</SettingRow>
                  <SettingRow label="Shells">{ps.shells}</SettingRow>
                  <SettingRow label="Infill">{ps.infill}% — {ps.infillPattern}</SettingRow>
                  <SettingRow label="Support">{ps.support ? "ON" : "OFF"}</SettingRow>
                  <SettingRow label="Brim">{ps.brim}</SettingRow>
                </div>
              </DashboardCard>

              <DashboardCard index={2} title="SUPPLIER INSTRUCTIONS" autoHeight withBackground={false}>
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                      For supplier use only — not visible to customers
                    </p>
                    <ul className="flex flex-col gap-1.5 text-[12px] text-white/50">
                      <li>• <span className="text-white/70">Assembly</span> — if the product has multiple parts that need to be joined</li>
                      <li>• <span className="text-white/70">Print orientation</span> — preferred direction for best results</li>
                      <li>• <span className="text-white/70">Finishing</span> — sanding, painting, coating requirements</li>
                      <li>• <span className="text-white/70">Special packaging</span> — fragile parts, protective wrapping</li>
                    </ul>
                  </div>
                  {order.supplierInstructionImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {order.supplierInstructionImages.map((src, i) => (
                        <div key={i} className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                          <img src={src} alt={`Assembly reference ${i + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] italic text-white/30">No special instructions for this order.</p>
                  )}
                </div>
              </DashboardCard>

              <DashboardCard index={3} title="SHIPPING ADDRESS" autoHeight withBackground={false}>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                  <span className="text-sm text-zinc-200">{order.shippingAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy Address"}
                  </button>
                </div>
              </DashboardCard>
            </div>

            {/* ─── RIGHT COLUMN ────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <DashboardCard index={4} title="STATUS" autoHeight withBackground={false} className="z-20">
                <div className="flex flex-col gap-3">

                  {/* Current status + dropdown */}
                  <div ref={statusDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusDropdownOpen((o) => !o)}
                      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 transition-colors hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusCfg.dot}`} />
                        <span className={`text-[13px] font-bold uppercase tracking-wide ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-white/30">Change ▾</span>
                    </button>

                    {statusDropdownOpen && createPortal(
                      <motion.div
                        ref={statusMenuRef}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
                        className="fixed z-[200] origin-top rounded-xl border border-white/10 bg-[rgba(10,18,12,0.97)] py-1.5 shadow-xl"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {SUPPLIER_EDITABLE_STATUS_KEYS.map((s, i) => {
                          const optionCfg = getStatusConfig(s);
                          const isActive = s === order.status;
                          return (
                            <motion.button
                              key={s}
                              type="button"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.18, ease: "easeOut", delay: i * 0.03 }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateStatus(s);
                                setStatusDropdownOpen(false);
                              }}
                              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wide transition-colors hover:bg-white/[0.06] ${optionCfg.text} ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                            >
                              <span className={`h-2 w-2 shrink-0 rounded-full ${optionCfg.dot}`} />
                              {optionCfg.label}
                              {isActive && <span className="ml-auto text-[10px]">✓</span>}
                            </motion.button>
                          );
                        })}
                      </motion.div>,
                      document.body,
                    )}
                  </div>

                  {/* Next action button */}
                  {nextAction && (
                    <button
                      type="button"
                      onClick={() => updateStatus(nextAction)}
                      className="rounded-md bg-green-500 py-2.5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                    >
                      MARK AS DONE
                    </button>
                  )}

                  {/* Reject / Report Issue button */}
                  {order.status !== "shipped" && order.status !== "ready" && order.status !== "delivered" && order.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => setRejectModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-md border border-red-400/30 bg-red-400/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-400/20"
                    >
                      <AlertTriangle size={14} />
                      REPORT AN ISSUE
                    </button>
                  )}

                  {order.status === "cancelled" && (
                    <p className="text-center text-[12px] text-zinc-500">This order was cancelled.</p>
                  )}
                </div>
              </DashboardCard>

              <DashboardCard index={5} title="Revenue" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <InfoRow label="AMOUNT">
                    <span className="text-[14px] font-bold text-green-500">${order.payment.toFixed(2)}</span>
                  </InfoRow>
                  <InfoRow label="STATUS">
                    <span className={order.status === "shipped" || order.status === "ready" || order.status === "delivered" ? "text-[13px] font-semibold text-green-500" : "text-[13px] font-semibold text-yellow-400"}>
                      {order.status === "shipped" || order.status === "ready" || order.status === "delivered" ? "Paid" : "Pending"}
                    </span>
                  </InfoRow>
                  <InfoRow label="DATE">
                    <span className="text-[13px] text-zinc-200">{formatDate(order.date)}</span>
                  </InfoRow>
                </div>
              </DashboardCard>

              <DashboardCard index={6} title="3D FILE" autoHeight withBackground={false}>
                {order.modelFileName ? (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07]">
                      <Box size={18} className="text-zinc-300" />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">{order.modelFileName}</span>
                    <button
                      type="button"
                      disabled
                      title="No file server connected in this demo"
                      className="shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-zinc-400 opacity-50 cursor-not-allowed"
                    >
                      Download
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] italic text-white/30">No 3D file attached to this product.</p>
                )}
              </DashboardCard>
            </div>
          </div>
        </DashboardPage>
      </motion.div>

      <AnimatePresence>
        {rejectModalOpen && (
          <RejectModal
            key="reject-modal"
            orderId={order.id}
            onClose={() => { setRejectModalOpen(false); setRejectReason(""); }}
            onSubmit={(reason) => {
              setRejectReason(reason);
              updateStatus("issue");
            }}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
