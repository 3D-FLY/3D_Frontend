import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import {
  ISSUE_TYPE_LABEL,
  formatDateTime,
  getAdminOrderById,
} from "./adminOrders.js";

const ORDERS_PATH = "/dashboard/admin/orders";
const ITEMS_GRID = "grid-cols-[2fr_1fr_1fr_0.7fr_0.8fr]";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-2.5 last:border-0">
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </span>
      <div className="flex min-w-0 items-center justify-end gap-1.5 text-right">{children}</div>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-zinc-400">Order not found.</p>
        <button
          type="button"
          onClick={() => navigate(ORDERS_PATH)}
          className="flex items-center gap-2 text-sm text-green-500 hover:underline"
        >
          <ArrowLeft size={15} /> Back to Orders
        </button>
      </div>
    </DashboardLayout>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = getAdminOrderById(id);

  if (!order) return <NotFound />;

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(ORDERS_PATH)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                title="Back to Orders"
              >
                <ArrowLeft size={18} />
              </button>
              <DashboardPageTitle className="truncate">Order #{order.orderId}</DashboardPageTitle>
            </div>
            <div className="shrink-0">
              <OrderStatusPill status={order.status} size="lg" />
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ─── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {order.issue && (
              <div className="flex gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-400" />
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-400">
                    {ISSUE_TYPE_LABEL[order.issue.type] ?? "Issue"}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-200">{order.issue.detail}</p>
                </div>
              </div>
            )}

            <DashboardCard index={0} title="Items" autoHeight withBackground={false}>
              <div className="overflow-hidden rounded-xl border border-white/10">
                {/* Desktop header */}
                <div className={`hidden gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-2.5 md:grid ${ITEMS_GRID}`}>
                  {["Product", "Material", "Color", "Qty", "Unit Price"].map((h) => (
                    <span key={h} className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                      {h}
                    </span>
                  ))}
                </div>
                {order.items.map((item, i) => {
                  const border = i < order.items.length - 1 ? "border-b border-white/[0.07]" : "";
                  return (
                    <div key={i} className={border}>
                      {/* Desktop row */}
                      <div className={`hidden items-center gap-3 px-4 py-3 md:grid ${ITEMS_GRID}`}>
                        <span className="truncate text-sm font-medium text-white">{item.name}</span>
                        <span className="text-[12px] text-zinc-300">{item.material}</span>
                        <span className="text-[12px] text-zinc-300">{item.color}</span>
                        <span className="text-[12px] font-semibold text-zinc-100">×{item.qty}</span>
                        <span className="text-[12px] font-semibold text-green-500">{item.unitPrice}</span>
                      </div>
                      {/* Mobile block */}
                      <div className="flex flex-col gap-1 px-4 py-3 md:hidden">
                        <span className="text-sm font-medium text-white">{item.name}</span>
                        <span className="text-[12px] text-zinc-300">
                          {item.material} · {item.color}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-zinc-100">×{item.qty}</span>
                          <span className="text-[12px] font-semibold text-green-500">{item.unitPrice}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardCard>

            <DashboardCard index={1} title="Shipping Address" autoHeight withBackground={false}>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <span className="text-sm leading-relaxed text-zinc-200">{order.address}</span>
              </div>
            </DashboardCard>
          </div>

          {/* ─── RIGHT COLUMN ────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <DashboardCard index={2} title="Customer" autoHeight withBackground={false}>
              <div className="flex flex-col">
                <InfoRow label="Name">
                  <span className="truncate text-[13px] font-semibold text-white">{order.customer}</span>
                </InfoRow>
                <InfoRow label="Email">
                  <span className="truncate text-[13px] text-zinc-200">{order.email}</span>
                </InfoRow>
                <InfoRow label="Phone">
                  <span className="truncate text-[13px] text-zinc-200">{order.phone}</span>
                </InfoRow>
              </div>
            </DashboardCard>

            <DashboardCard index={3} title="Supplier" autoHeight withBackground={false}>
              {order.supplier ? (
                <span className="text-sm font-semibold text-white">{order.supplier}</span>
              ) : (
                <span className="text-sm italic text-zinc-500">Not assigned yet</span>
              )}
            </DashboardCard>

            <DashboardCard index={4} title="Tracking" autoHeight withBackground={false}>
              {order.tracking ? (
                <span className="font-mono text-sm font-semibold text-green-500">{order.tracking}</span>
              ) : (
                <span className="text-sm italic text-zinc-500">No tracking yet</span>
              )}
            </DashboardCard>

            <DashboardCard index={5} title="Summary" autoHeight withBackground={false}>
              <div className="flex flex-col">
                <InfoRow label="Store">
                  <span className="truncate text-[13px] text-zinc-200">{order.store}</span>
                </InfoRow>
                <InfoRow label="Placed">
                  <span className="text-[13px] text-zinc-200">{formatDateTime(order.date)}</span>
                </InfoRow>
                <InfoRow label="Total">
                  <span className="text-[14px] font-bold text-green-500">{order.total}</span>
                </InfoRow>
              </div>
            </DashboardCard>
          </div>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}
