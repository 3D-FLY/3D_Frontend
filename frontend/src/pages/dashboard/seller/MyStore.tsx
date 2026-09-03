import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import ScrollableContent from "../../../features/dashboard/components/ScrollableContent.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import NotificationListItem from "../../../features/dashboard/components/NotificationListItem.js";
import { getNotificationsByRole } from "../../../data/mockNotifications.js";
import { getStatusConfig, type OrderStatusKey as OrderStatus } from "../../../constants/orderStatusConfig.js";
import soldierXPTImg from "../../../assets/soldierxpt.png?url";
import { mockOrders } from "../../../data/mockOrders.js";
import { mockProducts } from "../../../data/mockProducts.js";
import { mockSuppliers } from "../../../data/mockSuppliers.js";
import { CURRENT_SELLER_ID } from "../../../data/currentUser.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";

// ── Derived seller data ──────────────────────────────────────────────────────

const sellerOrders = mockOrders.filter((o) => o.sellerId === CURRENT_SELLER_ID);

const HOME_STATUSES = ["pending", "in_production", "shipped", "issue"] as const satisfies readonly OrderStatus[];

const SELLER_STATUS: { status: OrderStatus; count: number }[] = HOME_STATUSES.map((status) => ({
  status,
  count: sellerOrders.filter((o) => o.status === status).length,
}));

const PLATFORM_DISPLAY_NAME: Record<string, string> = {
  shopify: "Shopify", ebay: "eBay", woocommerce: "WooCommerce", wix: "Wix", amazon: "Amazon", etsy: "Etsy",
};

const platformChartData = (() => {
  const counts = new Map<string, number>();
  for (const o of sellerOrders) {
    const label = PLATFORM_DISPLAY_NAME[o.platform] ?? o.platform;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, orders]) => ({ name, orders }));
})();

const PLATFORM_COLORS: Record<string, string> = {
  Shopify:     "#5ac422",
  eBay:        "#3b82f6",
  WooCommerce: "#a855f7",
  Wix:         "#f97316",
  Amazon:      "#facc15",
};

const PLATFORM_ICONS: Record<string, string> = {
  Shopify:     shopifyIcon,
  eBay:        ebayIcon,
  WooCommerce: woocommerceIcon,
  Wix:         wixIcon,
};

// ── Production Orders table ──────────────────────────────────────────────────

interface ProductionOrderRow {
  id: string;
  product: { name: string; image: string };
  supplier: string;
  date: string;
  status: OrderStatus;
}

const productionOrders: ProductionOrderRow[] = sellerOrders
  .filter((o) => o.status === "accepted" || o.status === "in_production" || o.status === "ready")
  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  .map((o) => {
    const product = mockProducts.find((p) => p.id === o.productId);
    const supplier = mockSuppliers.find((s) => s.id === o.supplierId);
    return {
      id: o.id,
      product: { name: product?.name ?? "Unknown", image: product?.image ?? "" },
      supplier: supplier?.name ?? "Unknown",
      date: o.createdAt,
      status: o.status,
    };
  });

const PRODUCTION_TABLE_COLUMNS = [
  { key: "product",  header: "Product"   },
  { key: "id",       header: "Order #"   },
  { key: "date",     header: "Date"      },
  { key: "supplier", header: "Supplier"  },
  { key: "status",   header: "Status"    },
];

const PRODUCTION_TABLE_GRID = "2.2fr 0.9fr 1.1fr 1.3fr 1fr";

function ProductionProductCell({ product }: { product: { name: string; image: string } }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
        {imgError || !product.image ? (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={24} className="text-zinc-600" />
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
      <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-white">
        {product.name}
      </span>
    </div>
  );
}

function formatProductionDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Best seller ───────────────────────────────────────────────────────────

const bestSeller = (() => {
  const byProduct = new Map<string, { count: number; revenue: number }>();
  for (const o of sellerOrders) {
    const entry = byProduct.get(o.productId) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += o.sellerPrice * o.quantity;
    byProduct.set(o.productId, entry);
  }
  let bestId: string | null = null;
  let best = { count: 0, revenue: 0 };
  for (const [id, stats] of byProduct) {
    if (stats.count > best.count) {
      bestId = id;
      best = stats;
    }
  }
  const product = bestId ? mockProducts.find((p) => p.id === bestId) : undefined;
  return { product, ...best };
})();

// ── Monthly stats ─────────────────────────────────────────────────────────

function isSameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

function pctChange(curr: number, prev: number): string {
  if (prev === 0) return curr > 0 ? "+100%" : "0%";
  const pct = Math.round(((curr - prev) / prev) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

const now = new Date();
const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);

const ordersThisMonth = sellerOrders.filter((o) => isSameMonth(o.createdAt, now));
const ordersLastMonth = sellerOrders.filter((o) => isSameMonth(o.createdAt, lastMonthRef));
const revenueThisMonth = ordersThisMonth.reduce((s, o) => s + o.sellerPrice * o.quantity, 0);
const revenueLastMonth = ordersLastMonth.reduce((s, o) => s + o.sellerPrice * o.quantity, 0);

// ── Derived data ────────────────────────────────────────────────────────────

const dashboardCardSurface =
  "rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] backdrop-blur-[12px]";

function PlatformTick({ x, y, payload }: any) {
  const icon = PLATFORM_ICONS[payload?.value ?? ""];
  const cx = x ?? 0;
  const cy = y ?? 0;
  return (
    <g>
      {icon && <image href={icon} x={cx - 16} y={cy + 4} width={32} height={32} />}
      <text x={cx} y={cy + 54} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={12}>
        {payload?.value}
      </text>
    </g>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function MyStore() {
  const navigate = useNavigate();

  const sellerNotifications = useMemo(
    () => getNotificationsByRole("seller").filter((a) => a.status !== "resolved"),
    [],
  );

  return (
    <DashboardLayout role="seller">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage title="Welcome, Raz" titleClassName="italic">

          {/* ── 1. ANALYTICS ─────────────────────────────────────────────── */}
          <div
            className={`flex items-stretch py-8 gap-0 ${dashboardCardSurface}`}
            style={{ minHeight: "160px" }}
          >
            {/* 1/3: Orders This Month */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <span
                className="text-[11px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Orders This Month
              </span>
              <span
                className="text-[52px] font-bold leading-none text-white"
                style={{ textShadow: "0 0 40px rgba(255, 255, 255, 0.15)" }}
              >
                {ordersThisMonth.length}
              </span>
              <span className="text-[15px] font-semibold text-green">
                {pctChange(ordersThisMonth.length, ordersLastMonth.length)} from last month
              </span>
            </div>

            <div className="mx-6 w-px self-stretch bg-white/10" />

            {/* 1/3: Revenues */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <span
                className="text-[11px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Revenues
              </span>
              <span
                className="text-[52px] font-bold leading-none text-white"
                style={{ textShadow: "0 0 40px rgba(255, 255, 255, 0.15)" }}
              >
                ${revenueThisMonth.toLocaleString()}
              </span>
              <span className="text-[15px] font-semibold text-green">
                {pctChange(revenueThisMonth, revenueLastMonth)} from last month
              </span>
            </div>

            <div className="mx-6 w-px self-stretch bg-white/10" />

            {/* 1/3: Best Seller */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2">
              <span
                className="text-[11px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Best Seller
              </span>
              <img
                src={bestSeller.product?.image || soldierXPTImg}
                alt={bestSeller.product?.name ?? "Best Seller"}
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="font-staatliches text-[24px] uppercase leading-none text-white">
                {bestSeller.product?.name ?? "—"}
              </p>
              <span className="text-[15px] font-semibold text-green-500">
                {bestSeller.count} orders · ${bestSeller.revenue.toLocaleString()}
              </span>
            </div>
          </div>
    

          {/* ── 2. ORDER STATUS ──────────────────────────────────────────── */}
          <div className="grid w-full auto-rows-[minmax(240px,auto)] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {SELLER_STATUS.map(({ status, count }) => {
              const cfg = getStatusConfig(status);
              return (
                <StatusBadge
                  key={status}
                  count={count}
                  label={cfg.label}
                  accentColor={cfg.accentColor}
                  onClick={() => navigate(`/dashboard/seller/orders?status=${status}`)}
                />
              );
            })}
          </div>

          {/* ── 3 + 4. NOTIFICATIONS + TOP PLATFORM (2-col) ────────────────────── */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">

            {/* NOTIFICATIONS */}
            <DashboardCard title="Notifications" autoHeight className="h-full col-span-2" index={2} viewAllTo="/dashboard/seller/notifications">
              <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                <ScrollableContent scrollbarSide="left">
                  {sellerNotifications.map((notification) => (
                    <NotificationListItem
                      key={notification.id}
                      orderId={notification.orderId}
                      title={notification.title}
                      description={notification.description}
                      reason={notification.reason}
                      onClick={() => navigate(`/dashboard/seller/notifications/${notification.id}`)}
                    />
                  ))}
                </ScrollableContent>
              </div>
            </DashboardCard>

            {/* TOP PLATFORM */}
            <DashboardCard title="Top Platform" fill className="h-full" index={3}>
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformChartData} barSize={40} barCategoryGap="15%">
                      <Bar dataKey="orders" radius={[6, 6, 0, 0]} barSize={40}>
                        {platformChartData.map((entry) => (
                          <Cell key={entry.name} fill={PLATFORM_COLORS[entry.name] ?? "#5ac422"} />
                        ))}
                      </Bar>
                      <XAxis
                        dataKey="name"
                        tick={<PlatformTick />}
                        axisLine={false}
                        tickLine={false}
                        height={70}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: 12,
                        }}
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </DashboardCard>

          </div>

          {/* ── 5. ORDERS IN PRODUCTION ──────────────────────────────────── */}
          <DashboardCard title="Orders in Production" index={4} autoHeight viewAllTo="/dashboard/seller/orders">
            <DashboardTable
              variant="list"
              gridTemplateColumns={PRODUCTION_TABLE_GRID}
              columns={PRODUCTION_TABLE_COLUMNS}
              rows={productionOrders}
              getRowKey={(o) => o.id}
              scrollable={false}
              hoverable
              emptyMessage="No orders currently in production."
              renderCell={(o, key) => {
                if (key === "product") {
                  return <ProductionProductCell product={o.product} />;
                }
                if (key === "id") {
                  return (
                    <span className="truncate text-[clamp(12px,1vw,14px)] text-white/50">
                      {o.id}
                    </span>
                  );
                }
                if (key === "date") {
                  return (
                    <span className="text-[11px] text-zinc-300">
                      {formatProductionDate(o.date)}
                    </span>
                  );
                }
                if (key === "supplier") {
                  return (
                    <span className="truncate text-[clamp(12px,1vw,14px)] text-white/50">
                      {o.supplier}
                    </span>
                  );
                }
                if (key === "status") {
                  return <OrderStatusPill status={o.status} />;
                }
                return null;
              }}
            />
          </DashboardCard>

        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
