import { useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import { getStatusConfig } from "../../../constants/orderStatus.js";
import { mockOrderDetails } from "./mockOrders.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon      from "../../../assets/icons/shops/amazon-icon.svg?url";
import etsyIcon        from "../../../assets/icons/shops/etsy-icon.svg?url";

// ─── Platform maps ────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  shopify: shopifyIcon, ebay: ebayIcon, woocommerce: woocommerceIcon,
  wix: wixIcon, amazon: amazonIcon, etsy: etsyIcon,
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify", ebay: "eBay", woocommerce: "WooCommerce",
  wix: "Wix", amazon: "Amazon", etsy: "Etsy",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </span>
      <div className="flex flex-wrap justify-end gap-1.5">{children}</div>
    </div>
  );
}

function SettingValue({ children }: { children: ReactNode }) {
  return <span className="text-[13px] font-medium text-zinc-200">{children}</span>;
}

function OptionBadge({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <span
      className={[
        "rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        active
          ? "border-[#5ac422]/40 bg-[#5ac422]/15 text-[#5ac422]"
          : "border-white/10 bg-white/[0.03] text-zinc-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-2.5 last:border-0">
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        {label}
      </span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  const icon = PLATFORM_ICONS[key];
  const label = PLATFORM_LABELS[key] ?? platform;
  if (icon) {
    return <img src={icon} alt={label} title={label} className="h-5 w-5 object-contain" />;
  }
  return (
    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-zinc-400">
      {label}
    </span>
  );
}

// ─── Not-found state ──────────────────────────────────────────────────────────

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <DashboardLayout role="seller">
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-zinc-400">Order not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#5ac422] hover:underline"
        >
          <ArrowLeft size={15} /> Back to Orders
        </button>
      </div>
    </DashboardLayout>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order = mockOrderDetails.find((o) => o.id.replace("#", "") === id);
  const [imgError, setImgError] = useState(false);

  if (!order) {
    return <NotFound onBack={() => navigate("/dashboard/seller/orders")} />;
  }

  const statusCfg = getStatusConfig(order.status);
  const ps = order.product.printSettings;
  const { unitPrice, quantity, platformFeePercent } = order.pricing;
  const subtotal = unitPrice * quantity;
  const fee      = subtotal * (platformFeePercent / 100);
  const total    = subtotal - fee;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

  return (
    <DashboardLayout role="seller">
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
                  onClick={() => navigate("/dashboard/seller/orders")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                  title="Back to Orders"
                >
                  <ArrowLeft size={18} />
                </button>
                <DashboardPageTitle className="truncate">
                  ORDER {order.id}
                </DashboardPageTitle>
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

            {/* ─── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-2">

              {/* Section 1 — Product Info */}
              <DashboardCard index={0} title="PRODUCT" autoHeight withBackground={false}>
                <div className="flex flex-col gap-6 sm:flex-row">

                  {/* Image */}
                  <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
                    {imgError || !order.product.image ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package size={36} className="text-zinc-600" />
                      </div>
                    ) : (
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-4">
                    <div>
                      <p className="text-xl font-bold text-white">{order.product.name}</p>
                      <p className="text-xs text-white/40">{order.product.sku}</p>
                    </div>

                    {/* Platform icons */}
                    <div className="flex items-center gap-2">
                      {order.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} />
                      ))}
                    </div>

                    {/* Customer selection */}
                    <div className="flex flex-col">
                      <InfoRow label="COLOR">
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: order.customerSelection.colorHex }}
                        />
                        <span className="text-[13px] text-zinc-200">
                          {order.customerSelection.color}
                        </span>
                      </InfoRow>
                      <InfoRow label="QTY">
                        <span className="text-[13px] text-zinc-200">
                          ×{order.customerSelection.quantity}
                        </span>
                      </InfoRow>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Section 2 — Print Settings */}
              <DashboardCard index={1} title="PRINT SETTINGS" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <SettingRow label="Tech">
                    {(["FDM", "SLS", "SLA"] as const).map((t) => (
                      <OptionBadge key={t} active={ps.tech === t}>{t}</OptionBadge>
                    ))}
                  </SettingRow>
                  <SettingRow label="Material">
                    {["PLA", "ABS", "PETG", "TPU", "ASA", "Resin"].map((m) => (
                      <OptionBadge key={m} active={ps.material === m}>{m}</OptionBadge>
                    ))}
                  </SettingRow>
                  <SettingRow label="Layer Height">
                    <SettingValue>{ps.layerHeight} mm</SettingValue>
                  </SettingRow>
                  <SettingRow label="Shells">
                    <SettingValue>{ps.shells}</SettingValue>
                  </SettingRow>
                  <SettingRow label="Infill">
                    <SettingValue>{ps.infill}% — {ps.infillPattern}</SettingValue>
                  </SettingRow>
                  <SettingRow label="Top Shell Layers">
                    <SettingValue>{ps.topShellLayers}</SettingValue>
                  </SettingRow>
                  <SettingRow label="Bottom Shell Layers">
                    <SettingValue>{ps.bottomShellLayers}</SettingValue>
                  </SettingRow>
                  <SettingRow label="Support">
                    <OptionBadge active={ps.support}>{ps.support ? "ON" : "OFF"}</OptionBadge>
                  </SettingRow>
                  <SettingRow label="Brim">
                    <SettingValue>{ps.brim}</SettingValue>
                  </SettingRow>
                  <SettingRow label="Brim Width">
                    <SettingValue>{ps.brimWidth} mm</SettingValue>
                  </SettingRow>
                  <SettingRow label="Seam">
                    <SettingValue>{ps.seam}</SettingValue>
                  </SettingRow>
                </div>
              </DashboardCard>

              {/* Section 3 — Timeline */}
              <DashboardCard index={2} title="TIMELINE" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  {order.timeline.map((step, i) => {
                    const isLast = i === order.timeline.length - 1;
                    const dotClass = step.done
                      ? "bg-green-500"
                      : step.active
                        ? statusCfg.dot
                        : "bg-zinc-700";
                    const labelClass = step.active
                      ? "text-white font-semibold"
                      : step.done
                        ? "text-zinc-400"
                        : "text-zinc-600";
                    const dateLabel = step.date
                      ? step.date
                      : step.active
                        ? "In progress..."
                        : "—";
                    return (
                      <div key={step.step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotClass}`} />
                          {!isLast && <div className="my-1 w-px flex-1 bg-white/10" />}
                        </div>
                        <div className="pb-4">
                          <p className={`text-[13px] ${labelClass}`}>{step.step}</p>
                          <p className="text-[11px] text-zinc-600">{dateLabel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>
            </div>

            {/* ─── RIGHT COLUMN ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-1">

              {/* Section 4 — Summary */}
              <DashboardCard index={3} title="SUMMARY" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  <InfoRow label="ORDER #">
                    <span className="font-mono text-[13px] text-zinc-200">{order.id}</span>
                  </InfoRow>
                  <InfoRow label="DATE">
                    <span className="text-[13px] text-zinc-200">{formatDate(order.date)}</span>
                  </InfoRow>
                  <InfoRow label="STATUS">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusCfg.text} ${statusCfg.border} ${statusCfg.bg}`}
                    >
                      {statusCfg.label}
                    </span>
                  </InfoRow>
                  <InfoRow label="PLATFORM">
                    <div className="flex items-center gap-1.5">
                      {order.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} />
                      ))}
                    </div>
                  </InfoRow>
                  <InfoRow label="SUPPLIER">
                    <span className="text-[13px] text-zinc-200">{order.supplier.name}</span>
                  </InfoRow>
                </div>
              </DashboardCard>

              {/* Section 5 — Pricing */}
              <DashboardCard index={4} title="PRICING" autoHeight withBackground={false}>
                <div className="flex flex-col">
                  {[
                    { label: "UNIT PRICE",                         value: `$${unitPrice.toFixed(2)}`   },
                    { label: "QUANTITY",                           value: `×${quantity}`                },
                    { label: "SUBTOTAL",                           value: `$${subtotal.toFixed(2)}`     },
                    { label: `PLATFORM FEE (${platformFeePercent}%)`, value: `$${fee.toFixed(2)}`      },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between border-b border-white/5 py-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                        {label}
                      </span>
                      <span className="text-[13px] text-zinc-200">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                      TOTAL
                    </span>
                    <span className="text-lg font-bold text-green-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </DashboardCard>

              {/* Section 6 — Supplier */}
              <DashboardCard index={5} title="SUPPLIER" autoHeight withBackground={false}>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-bold text-white">{order.supplier.name}</p>
                    <p className="text-sm text-zinc-500">{order.supplier.city}</p>
                  </div>
                  <div className="flex flex-col">
                    <InfoRow label="PRINT TIME">
                      <span className="text-[13px] text-zinc-200">{order.printTime}</span>
                    </InfoRow>
                    <InfoRow label="WEIGHT">
                      <span className="text-[13px] text-zinc-200">{order.weight}</span>
                    </InfoRow>
                  </div>

                  {order.status === "issue" && (
                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                        <p className="text-[13px] text-yellow-300">
                          There is an issue with this order.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-md border border-yellow-500/50 py-1.5 text-[12px] font-bold uppercase tracking-wide text-yellow-400 transition-colors hover:bg-yellow-500/10"
                      >
                        Open Ticket
                      </button>
                    </div>
                  )}
                </div>
              </DashboardCard>
            </div>
          </div>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
