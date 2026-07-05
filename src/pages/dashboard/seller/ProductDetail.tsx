import { useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Package } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { EditProductModal } from "./Products.js";
import { getProducts, saveProducts, type Product, type ProductForm } from "./mockProducts.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon      from "../../../assets/icons/shops/amazon-icon.svg?url";
import etsyIcon        from "../../../assets/icons/shops/etsy-icon.svg?url";

// ─── Platform constants ───────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  shopify: shopifyIcon, ebay: ebayIcon, woocommerce: woocommerceIcon,
  wix: wixIcon, amazon: amazonIcon, etsy: etsyIcon,
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify", ebay: "eBay", woocommerce: "WooCommerce",
  wix: "Wix", amazon: "Amazon", etsy: "Etsy",
};

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR_CSS: Record<string, string> = {
  black: "#111827", white: "#f9fafb", gray: "#9ca3af", grey: "#9ca3af",
  red: "#ef4444",   blue: "#3b82f6",  yellow: "#eab308", green: "#22c55e",
  orange: "#f97316", silver: "#d1d5db", pink: "#ec4899", purple: "#a855f7",
  brown: "#b45309",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorDot({ color }: { color: string }) {
  const css = COLOR_CSS[color.toLowerCase()];
  if (css) {
    return (
      <span
        title={color}
        className="inline-block h-5 w-5 rounded-full border border-white/20"
        style={{ backgroundColor: css }}
      />
    );
  }
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
      {color}
    </span>
  );
}

function InfoField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">{label}</span>
      {children}
    </div>
  );
}

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

// ─── Not-found state ──────────────────────────────────────────────────────────

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <DashboardLayout role="seller">
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-zinc-400">Product not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#5ac422] hover:underline"
        >
          <ArrowLeft size={15} /> Back to Products
        </button>
      </div>
    </DashboardLayout>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const found = getProducts().find((p) => p.id === id);
  const [product, setProduct] = useState<Product | undefined>(found);
  const [imgError, setImgError]   = useState(false);
  const [editOpen, setEditOpen]   = useState(false);

  if (!product) {
    return <NotFound onBack={() => navigate("/dashboard/seller/products")} />;
  }

  const ps = product.printSettings;
  const totalRevenue = product.recentOrders.reduce((s, o) => s + o.total, 0);
  const totalIssues  = product.recentOrders.filter((o) => o.status === "issue").length;

  const handleSave = (form: ProductForm) => {
    if (!product) return;
    const updated: Product = {
      ...product,
      name:   form.name,
      sku:    form.sku,
      cost:   parseFloat(form.cost)  || product.cost,
      price:  parseFloat(form.price) || product.price,
      stores: form.stores,
    };
    setProduct(updated);
    saveProducts(getProducts().map((p) => (p.id === updated.id ? updated : p)));
    setEditOpen(false);
  };

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
                  onClick={() => navigate("/dashboard/seller/products")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                  title="Back to Products"
                >
                  <ArrowLeft size={18} />
                </button>
                <DashboardPageTitle className="truncate">
                  {product.name.toUpperCase()}
                </DashboardPageTitle>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#5ac422] px-4 py-2 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
              >
                <Pencil size={13} />
                Edit
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* ── Section 1: Product Info (full width) ────────────────────── */}
            <div className="lg:col-span-2">
              <DashboardCard index={0} title="PRODUCT INFO" autoHeight withBackground={false}>
                <div className="flex flex-col gap-6 sm:flex-row">

                  {/* Image */}
                  <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
                    {imgError || !product.image ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package size={40} className="text-zinc-600" />
                      </div>
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>

                  {/* Info grid */}
                  <div className="flex flex-1 flex-col gap-5">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                      <InfoField label="Name">
                        <span className="text-[15px] font-bold text-white">{product.name}</span>
                      </InfoField>
                      <InfoField label="SKU">
                        <span className="text-sm text-zinc-300">{product.sku}</span>
                      </InfoField>
                      <InfoField label="Cost">
                        <span className="text-sm font-medium text-zinc-300">${product.cost.toFixed(2)}</span>
                      </InfoField>
                      <InfoField label="Price">
                        <span className="text-xl font-bold text-[#5ac422]">${product.price.toFixed(2)}</span>
                      </InfoField>
                    </div>

                    <InfoField label="Connected Stores">
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {product.stores.map((s) => {
                          const icon = PLATFORM_ICONS[s.toLowerCase()];
                          const label = PLATFORM_LABELS[s.toLowerCase()] ?? s;
                          if (icon) {
                            return <img key={s} src={icon} alt={label} title={label} className="h-6 w-6 object-contain" />;
                          }
                          return (
                            <span key={s} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </InfoField>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                      <InfoField label="Print Time">
                        <span className="text-sm text-zinc-200">{product.details.printTime}</span>
                      </InfoField>
                      <InfoField label="Weight">
                        <span className="text-sm text-zinc-200">{product.details.weight}</span>
                      </InfoField>
                      <InfoField label="Colors">
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {product.details.colors.map((c) => <ColorDot key={c} color={c} />)}
                        </div>
                      </InfoField>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>

            {/* ── Section 2: Print Settings (left) ────────────────────────── */}
            <DashboardCard index={1} title="PRINT SETTINGS" autoHeight withBackground={false}>
              <div className="flex flex-col">

                <SettingRow label="Tech">
                  {["FDM", "SLS", "SLA"].map((t) => (
                    <OptionBadge key={t} active={ps.tech === t}>{t}</OptionBadge>
                  ))}
                </SettingRow>

                <SettingRow label="Material">
                  {["PLA", "ABS", "PETG", "TPU", "ASA"].map((m) => (
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

            {/* ── Section 3: Order History (right) ────────────────────────── */}
            <DashboardCard index={2} title="ORDER HISTORY" autoHeight withBackground={false}>

              {/* Stat row */}
              <div className="mb-6 grid grid-cols-3 gap-3" style={{ height: 120 }}>
                <StatusBadge
                  count={product.recentOrders.length}
                  label="Total Orders"
                />
                <StatusBadge
                  count={`$${totalRevenue}`}
                  label="Revenue"
                  color="#5ac422"
                />
                <StatusBadge
                  count={totalIssues}
                  label="Issues"
                  color="#facc15"
                />
              </div>

              {product.recentOrders.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-500">No orders yet.</p>
              ) : (
                <DashboardTable
                  variant="data"
                  scrollable={false}
                  subtle
                  hoverable={false}
                  columns={[
                    { key: "order",  header: "Order #" },
                    { key: "date",   header: "Date"    },
                    { key: "status", header: "Status"  },
                    { key: "total",  header: "Total", align: "right" },
                    { key: "action", header: ""                       },
                  ]}
                  rows={product.recentOrders.slice(0, 5)}
                  getRowKey={(o) => o.id}
                  renderCell={(o, key) => {
                    if (key === "order")  return <span className="font-mono text-[12px] text-zinc-400">{o.id}</span>;
                    if (key === "date")   return <span className="text-[11px] text-zinc-300">{formatDate(o.date)}</span>;
                    if (key === "status") return <OrderStatusPill status={o.status} />;
                    if (key === "total")  return <span className="text-[12px] font-semibold text-[#5ac422]">${o.total.toFixed(2)}</span>;
                    if (key === "action") {
                      return (
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/seller/orders/${o.id.replace("#", "")}`)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-[#5ac422]/10 hover:text-[#5ac422]"
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

          </div>
        </DashboardPage>
      </motion.div>

      {editOpen && (
        <EditProductModal
          product={product}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
