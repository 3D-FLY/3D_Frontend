import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import {
  mockSupplierOrders,
  SUPPLIER_STATUS_LABEL,
  SUPPLIER_STATUS_COLOR,
  type SupplierOrder,
  type SupplierOrderStatus,
} from "./mockSupplier.js";

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

const NEXT_ACTION: Partial<Record<SupplierOrderStatus, { label: string; next: SupplierOrderStatus }>> = {
  accepted: { label: "Start Printing →", next: "printing" },
  printing: { label: "Mark as Done ✓", next: "done" },
  done: { label: "Mark as Shipped 📦", next: "shipped" },
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

export default function SupplierOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const found = mockSupplierOrders.find((o) => o.id.replace("#", "") === id);
  const [order, setOrder] = useState<SupplierOrder | undefined>(found);
  const [copied, setCopied] = useState(false);

  if (!order) {
    return <NotFound />;
  }

  const ps = order.printSettings;
  const statusColor = SUPPLIER_STATUS_COLOR[order.status];

  const updateStatus = (next: SupplierOrderStatus) => {
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
                className="shrink-0 rounded-full border px-3 py-1 text-[12px] font-bold uppercase tracking-wide"
                style={{ color: statusColor, borderColor: `${statusColor}4d`, backgroundColor: `${statusColor}1a` }}
              >
                {SUPPLIER_STATUS_LABEL[order.status]}
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <DashboardCard index={0} title="PRODUCT INFO" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <InfoRow label="PRODUCT">
                    <span className="text-[13px] font-semibold text-white">{order.productName}</span>
                  </InfoRow>
                  <InfoRow label="QUANTITY">
                    <span className="text-[13px] text-zinc-200">×{order.quantity}</span>
                  </InfoRow>
                  <InfoRow label="COLOR">
                    <span className="inline-block h-3.5 w-3.5 rounded-full border border-white/20 bg-zinc-400" />
                    <span className="text-[13px] text-zinc-200">{order.color}</span>
                  </InfoRow>
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

              <DashboardCard index={2} title="SHIPPING ADDRESS" autoHeight withBackground={false}>
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
              <DashboardCard index={3} title="STATUS" autoHeight withBackground={false}>
                <div className="flex flex-col gap-3">
                  {order.status === "proposed" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus("accepted")}
                        className="rounded-md bg-green-500 py-2.5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                      >
                        Accept Order ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus("cancelled")}
                        className="rounded-md border border-red-400/30 bg-red-400/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-400/20"
                      >
                        Reject ✗
                      </button>
                    </>
                  )}
                  {nextAction && (
                    <button
                      type="button"
                      onClick={() => updateStatus(nextAction.next)}
                      className="rounded-md bg-green-500 py-2.5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                    >
                      {nextAction.label}
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-md border border-white/10 py-2.5 text-[13px] font-bold uppercase tracking-wide text-zinc-500 opacity-60"
                    >
                      Delivered ✓
                    </button>
                  )}
                  {order.status === "cancelled" && (
                    <p className="text-center text-[12px] text-zinc-500">This order was cancelled.</p>
                  )}
                </div>
              </DashboardCard>

              <DashboardCard index={4} title="PAYMENT" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <InfoRow label="AMOUNT">
                    <span className="text-[14px] font-bold text-green-500">${order.payment.toFixed(2)}</span>
                  </InfoRow>
                  <InfoRow label="STATUS">
                    <span className={order.status === "shipped" || order.status === "done" ? "text-[13px] font-semibold text-green-500" : "text-[13px] font-semibold text-yellow-400"}>
                      {order.status === "shipped" || order.status === "done" ? "Paid" : "Pending"}
                    </span>
                  </InfoRow>
                  <InfoRow label="DATE">
                    <span className="text-[13px] text-zinc-200">{formatDate(order.date)}</span>
                  </InfoRow>
                </div>
              </DashboardCard>
            </div>
          </div>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
