import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import ScrollableContent from "../../../features/dashboard/components/ScrollableContent.js";
import type { AttentionReason } from "../../../features/dashboard/components/OrderAttentionList.js";
import { getStatusConfig, type OrderStatusKey as OrderStatus } from "../../../constants/orderStatusConfig.js";
import shopifyIcon from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon from "../../../assets/icons/shops/wix-company-icon.svg?url";
import soldierXPTImg from "../../../assets/soldierxpt.png?url";

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

const mockPlatforms = [
  { name: "Shopify",     orders: 127, icon: shopifyIcon,     isTop: true  },
  { name: "eBay",        orders: 43,  icon: ebayIcon,        isTop: false },
  { name: "WooCommerce", orders: 28,  icon: woocommerceIcon, isTop: false },
  { name: "Wix",         orders: 15,  icon: wixIcon,         isTop: false },
];

// ── Spotlight Carousel ───────────────────────────────────────────────────────

interface ProductionItem {
  orderId: string;
  product: string;
  image:   string;
}

const inProduction: ProductionItem[] = [
  { orderId: "#0041", product: "SoldierXPT", image: soldierXPTImg },
  { orderId: "#0039", product: "DragonMini", image: soldierXPTImg },
  { orderId: "#0038", product: "RocketBase", image: soldierXPTImg },
  { orderId: "#0037", product: "SoldierXPT", image: soldierXPTImg },
  { orderId: "#0036", product: "MechBot",    image: soldierXPTImg },
  { orderId: "#0035", product: "WarriorX",   image: soldierXPTImg },
  { orderId: "#0034", product: "DragonMini", image: soldierXPTImg },
];

function SpotlightCarousel({ items }: { items: ProductionItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const n = items.length;

  useEffect(() => {
    const timer = setInterval(() => setActiveIdx((i) => (i + 1) % n), 3000);
    return () => clearInterval(timer);
  }, [n]);

  const advance = () => setActiveIdx((i) => (i + 1) % n);
  const retreat = () => setActiveIdx((i) => (i - 1 + n) % n);

  const visible = [-2, -1, 0, 1, 2].flatMap((offset) => {
    const item = items[(activeIdx + offset + n) % n];
    return item ? [{ item, offset }] : [];
  });

  return (
    <div className="relative flex items-center justify-center gap-3">

      {/* Left arrow */}
      <button
        type="button"
        onClick={retreat}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
      >
        <ChevronLeft size={28} />
      </button>

      <AnimatePresence mode="popLayout" initial={false}>
        {visible.map(({ item, offset }) => {
          const isActive = offset === 0;
          const absOff   = Math.abs(offset);
          const opacity  = isActive ? 1 : absOff === 1 ? 0.6 : 0.3;
          const widthCls = isActive
            ? "w-[22%] max-w-[160px]"
            : absOff === 1
            ? "w-[16%] max-w-[120px]"
            : "w-[11%] max-w-[80px]";
          return (
            <motion.div
              key={item.orderId}
              layout
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`relative aspect-square flex-shrink-0 overflow-hidden rounded-xl ${widthCls}`}
              style={{ ...(isActive && { boxShadow: "0 0 24px rgba(90,196,34,0.2)" }) }}
            >
              {/* Full bleed image */}
              <img
                src={item.image}
                alt={item.product}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 30%, transparent 100%)" }}
              />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">
                    PRINTING
                  </span>
                </div>
                <p className="truncate text-sm font-bold text-white">{item.product}</p>
                <p className="text-xs text-white/50">{item.orderId}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Right arrow */}
      <button
        type="button"
        onClick={advance}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}

// ── Derived data ────────────────────────────────────────────────────────────

const dashboardCardSurface =
  "rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] backdrop-blur-[12px]";

const topPlatform    = mockPlatforms.find((p) => p.isTop)!;
const otherPlatforms = mockPlatforms.filter((p) => !p.isTop);

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
          <div className="flex gap-6" style={{ minHeight: "160px" }}>

            {/* Left: Orders This Month + Revenues (60%) */}
            <div className={`flex flex-[3] items-stretch py-8 ${dashboardCardSurface}`}>

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
                <span className="text-[13px] font-semibold text-green">+12% from last month</span>
              </div>

              <div className="mx-6 w-px self-stretch bg-white/10" />

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
                <span className="text-[13px] font-semibold text-green">+76% from last month</span>
              </div>

            </div>

            {/* Right: Best Seller card (40%) */}
            <div
              className="group relative flex-[2] min-h-[320px] cursor-pointer overflow-hidden rounded-2xl border border-white/10"
              style={{ boxShadow: "0 0 40px rgba(90, 196, 34, 0.15)" }}
            >
              {/* Full bleed image — scales on hover */}
              <div className="absolute inset-0 transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]">
                <img
                  src={soldierXPTImg}
                  alt="SoldierXPT"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                }}
              />

              {/* BEST SELLER badge — top left */}
              <span className="absolute left-3 top-3 z-10 rounded-full border border-green-500/40 bg-green-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-green-500">
                BEST SELLER
              </span>

              {/* Content anchored to bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <p className="mb-1.5 font-staatliches text-[34px] uppercase leading-none text-white">
                  SoldierXPT
                </p>
                <div className="flex items-center gap-2 text-[12px] text-white/50">
                  <span>34 orders</span>
                  <span className="text-white/25">·</span>
                  <span>$1,428 revenue</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── 2. ORDER STATUS ──────────────────────────────────────────── */}
          <DashboardCard title="Order Status" index={1} className="status-container">
            <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {SELLER_STATUS.map(({ status, count }) => {
                const cfg = getStatusConfig(status);
                return (
                  <div key={status} className="h-full">
                    <StatusBadge
                      count={count}
                      label={cfg.label}
                      accentColor={cfg.accentColor}
                    />
                  </div>
                );
              })}
            </div>
          </DashboardCard>

          {/* ── 3 + 4. ALERTS + TOP PLATFORM (2-col) ────────────────────── */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">

            {/* ALERTS */}
            <DashboardCard title="Alerts" autoHeight className="h-full" index={2}>
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
            <DashboardCard title="Top Platform" autoHeight className="h-full" index={3}>
              <div className="flex flex-col items-center gap-4 py-2">

                {/* Top platform — large */}
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={topPlatform.icon}
                    alt={topPlatform.name}
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-lg font-bold text-white">{topPlatform.name}</span>
                  <span className="text-sm font-semibold text-[#5ac422]">
                    {topPlatform.orders} orders this month
                  </span>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Other platforms — smaller row */}
                <div className="flex w-full justify-around">
                  {otherPlatforms.map((p) => (
                    <div key={p.name} className="flex flex-col items-center gap-1">
                      <img src={p.icon} alt={p.name} className="h-8 w-8 object-contain" />
                      <span className="text-xs text-zinc-400">{p.name}</span>
                      <span className="text-sm font-semibold text-white">{p.orders}</span>
                    </div>
                  ))}
                </div>

              </div>
            </DashboardCard>

          </div>

          {/* ── 5. ORDERS IN PRODUCTION ──────────────────────────────────── */}
          <DashboardCard title="Orders in Production" index={4} autoHeight withBackground={false}>
            <SpotlightCarousel items={inProduction} />
          </DashboardCard>

        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
