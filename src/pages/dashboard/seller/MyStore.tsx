import { useState } from "react";
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
import type { AttentionReason } from "../../../features/dashboard/components/OrderAttentionList.js";
import { getStatusConfig, type OrderStatusKey as OrderStatus } from "../../../constants/orderStatusConfig.js";
import soldierXPTImg from "../../../assets/soldierxpt.png?url";
import { mockOrderDetails } from "./mockOrders.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";

// ── Mock data ───────────────────────────────────────────────────────────────

const alertAccent: Record<AttentionReason, string> = {
  supplier_rejected: "border-l-red-400",
  no_supplier:       "border-l-orange-400",
  production_delay:  "border-l-orange-400",
  missing_data:      "border-l-yellow-400",
  shipping_issue:    "border-l-sky-400",
};

const mockAlerts = [
  { id: "#3012", title: "SUPPLIER REJECTED", desc: "Rejected by: Supplier A",      reason: "supplier_rejected" as const },
  { id: "#3015", title: "NO SUPPLIER FOUND", desc: "No match in Tel Aviv area",     reason: "no_supplier" as const },
  { id: "#3009", title: "MISSING DATA",      desc: "Missing: print file",           reason: "missing_data" as const },
  { id: "#3007", title: "SHIPPING DELAY",    desc: "Stuck at courier for 3 days",   reason: "shipping_issue" as const },
] as const;

const SELLER_STATUS: { status: OrderStatus; count: number }[] = [
  { status: "in_production", count: 7  },
  { status: "shipped",       count: 4  },
  { status: "delivered",     count: 34 },
  { status: "issue",         count: 1  },
];

const platformChartData = [
  { name: "Shopify",     orders: 127 },
  { name: "eBay",        orders: 43  },
  { name: "WooCommerce", orders: 28  },
  { name: "Wix",         orders: 15  },
];

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

const fallbackProductionOrders: ProductionOrderRow[] = [
  { id: "#0041", product: { name: "SoldierXPT", image: soldierXPTImg }, supplier: "PrintLab Berlin", date: "2025-05-12", status: "in_production" },
  { id: "#0039", product: { name: "DragonMini", image: soldierXPTImg }, supplier: "FormLabs TLV",    date: "2025-05-10", status: "in_production" },
  { id: "#0038", product: { name: "RocketBase", image: soldierXPTImg }, supplier: "PrintLab Berlin", date: "2025-05-08", status: "in_production" },
  { id: "#0037", product: { name: "SoldierXPT", image: soldierXPTImg }, supplier: "3D Masters NY",   date: "2025-05-03", status: "in_production" },
  { id: "#0036", product: { name: "MechBot",    image: soldierXPTImg }, supplier: "FormLabs TLV",    date: "2025-04-30", status: "in_production" },
];

const productionOrdersFromMock: ProductionOrderRow[] = mockOrderDetails
  .filter((o) => o.status === "in_production")
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .map((o) => ({
    id: o.id,
    product: { name: o.product.name, image: o.product.image },
    supplier: o.supplier.name,
    date: o.date,
    status: o.status,
  }));

const productionOrders =
  productionOrdersFromMock.length > 0 ? productionOrdersFromMock : fallbackProductionOrders;

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
                12
              </span>
              <span className="text-[15px] font-semibold text-green">
                +12% from last month
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
                $1,084
              </span>
              <span className="text-[15px] font-semibold text-green">
                +76% from last month
              </span>
            </div>

            <div className="mx-6 w-px self-stretch bg-white/10" />

            {/* 1/3: Best Seller */}
            <div className="flex flex-1 flex-col px-6 gap-3 items-center text-center">
              <span className="text-[16px] font-bold uppercase tracking-widest text-green-500">
                BEST SELLER
              </span>
              <div className="w-full flex justify-center">
                <img
                  src={soldierXPTImg}
                  alt="SoldierXPT"
                  className="object-cover rounded-xl"
                  style={{
                    width: "120px",
                    height: "120px",
                    aspectRatio: "1 / 1",
                  }}
                />
              </div>
              <p className="font-staatliches text-[32px] uppercase leading-none text-white">
                SoldierXPT
              </p>
              <div className="text-[12px] text-white/50">
                34 orders · $1,428 revenue
              </div>
            </div>
          </div>
    

          {/* ── 2. ORDER STATUS ──────────────────────────────────────────── */}
          <div className="grid min-h-[180px] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 w-full">
            {SELLER_STATUS.map(({ status, count }) => {
              const cfg = getStatusConfig(status);
              return (
                <StatusBadge
                  key={status}
                  count={count}
                  label={cfg.label}
                  accentColor={cfg.accentColor}
                />
              );
            })}
          </div>

          {/* ── 3 + 4. ALERTS + TOP PLATFORM (2-col) ────────────────────── */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">

            {/* ALERTS */}
            <DashboardCard title="Alerts" autoHeight className="h-full col-span-2" index={2}>
              <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                <ScrollableContent scrollbarSide="left">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`mb-3 flex min-h-[60px] cursor-pointer items-center gap-3 rounded-2xl border border-white/10 border-l-4 bg-[rgba(149,149,149,0.05)] px-5 py-2 transition-colors hover:bg-[rgba(149,149,149,0.1)] ${alertAccent[alert.reason]}`}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-[clamp(13px,1vw,14.5px)] font-semibold uppercase tracking-wide text-zinc-100">
                          {alert.id} — {alert.title}
                        </span>
                        <span className="truncate text-[11px] font-normal text-zinc-300">
                          {alert.desc}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm text-zinc-300">→</span>
                    </div>
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
          <DashboardCard title="Orders in Production" index={4} autoHeight>
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
