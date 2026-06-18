import { useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import HorizontalCarousel from "../../../features/dashboard/components/HorizontalCarousel.js";
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

const mockOrdersInProduction = [
  { id: 1, name: "SoldierXPT", image: "/mock/soldier.png"  },
  { id: 2, name: "WarriorX",   image: "/mock/warrior.png"  },
  { id: 3, name: "DragonFly",  image: "/mock/dragon.png"   },
  { id: 4, name: "MechBot",    image: "/mock/mech.png"     },
  { id: 5, name: "PhoenixV2",  image: "/mock/phoenix.png"  },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function ProductionCard({ name, image }: { name: string; image: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex min-w-[130px] flex-col items-center gap-2 rounded-xl border p-3"
      style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-800">
        {imgError || !image ? (
          <Package size={32} className="text-zinc-600" />
        ) : (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wide text-white">{name}</span>
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
              className={`relative flex flex-[2] flex-col items-center justify-center gap-3 overflow-hidden px-5 py-8 ${dashboardCardSurface}`}
            >
              {/* Decorative rank badge */}
              <span
                className="pointer-events-none absolute right-3 top-2 select-none font-extrabold leading-none"
                style={{ fontSize: 48, color: "rgba(90,196,34,0.15)" }}
              >
                #1
              </span>

              {/* Label */}
              <span
                className="text-[11px] font-semibold uppercase tracking-[2px]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Best Seller
              </span>

              {/* Product image */}
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-zinc-800/50">
                <img
                  src={soldierXPTImg}
                  alt="SoldierXPT"
                  className="h-full w-full object-contain drop-shadow-lg"
                  style={{ filter: "drop-shadow(0 0 12px rgba(90,196,34,0.25))" }}
                />
              </div>

              {/* Product name */}
              <span
                className="text-[22px] font-bold leading-tight text-white"
                style={{ textShadow: "0 0 20px rgba(90,196,34,0.3)" }}
              >
                SoldierXPT
              </span>

              {/* Divider */}
              <div
                className="w-10"
                style={{ height: 1, background: "rgba(90,196,34,0.2)" }}
              />

              {/* Units */}
              <span className="text-[13px] text-green">34 units sold</span>
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
          <DashboardCard title="Orders in Production" index={4}>
            <HorizontalCarousel>
              {mockOrdersInProduction.map((item) => (
                <ProductionCard key={item.id} name={item.name} image={item.image} />
              ))}
            </HorizontalCarousel>
          </DashboardCard>

        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
