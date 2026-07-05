import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import type { OrderStatusKey as OrderStatus } from "../../../constants/orderStatusConfig.js";
import { ORDER_STATUS_CONFIG } from "../../../constants/orderStatusConfig.js";
import shopifyIcon from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon from "../../../assets/icons/shops/amazon-icon.svg?url";
import etsyIcon from "../../../assets/icons/shops/etsy-icon.svg?url";

// ─── Platform maps ────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  shopify: shopifyIcon,
  ebay: ebayIcon,
  woocommerce: woocommerceIcon,
  wix: wixIcon,
  amazon: amazonIcon,
  etsy: etsyIcon,
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify",
  ebay: "eBay",
  woocommerce: "WooCommerce",
  wix: "Wix",
  amazon: "Amazon",
  etsy: "Etsy",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface SellerOrder {
  id: string;
  product: { name: string; image: string };
  platforms: string[];
  supplier: string;
  date: string;
  status: OrderStatus;
  total: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockOrders: SellerOrder[] = [
  { id: "#0041", product: { name: "SoldierXPT",  image: "/mock/soldier.png"  }, platforms: ["shopify"],           supplier: "PrintLab Berlin", date: "2025-05-12", status: "in_production", total: 42.00  },
  { id: "#0040", product: { name: "WarriorX",    image: "/mock/warrior.png"  }, platforms: ["woocommerce","ebay"], supplier: "3D Masters NY",   date: "2025-05-10", status: "shipped",        total: 67.50  },
  { id: "#0039", product: { name: "DragonMini",  image: "/mock/dragon.png"   }, platforms: ["wix"],               supplier: "FormLabs TLV",    date: "2025-05-08", status: "delivered",      total: 34.99  },
  { id: "#0038", product: { name: "RocketBase",  image: "/mock/rocket.png"   }, platforms: ["amazon"],            supplier: "PrintLab Berlin", date: "2025-05-06", status: "issue",          total: 89.00  },
  { id: "#0037", product: { name: "SoldierXPT",  image: "/mock/soldier.png"  }, platforms: ["shopify","ebay"],    supplier: "3D Masters NY",   date: "2025-05-03", status: "delivered",      total: 42.00  },
  { id: "#0036", product: { name: "DragonMini",  image: "/mock/dragon.png"   }, platforms: ["etsy"],              supplier: "FormLabs TLV",    date: "2025-04-30", status: "shipped",        total: 34.99  },
  { id: "#0035", product: { name: "MechBot",     image: "/mock/mech.png"     }, platforms: ["shopify"],           supplier: "PrintLab Berlin", date: "2025-04-28", status: "delivered",      total: 58.00  },
  { id: "#0034", product: { name: "WarriorX",    image: "/mock/warrior.png"  }, platforms: ["woocommerce"],       supplier: "3D Masters NY",   date: "2025-04-25", status: "in_production",  total: 67.50  },
  { id: "#0033", product: { name: "RocketBase",  image: "/mock/rocket.png"   }, platforms: ["shopify","amazon"],  supplier: "PrintLab Berlin", date: "2025-04-22", status: "delivered",      total: 89.00  },
  { id: "#0032", product: { name: "PhoenixV2",   image: "/mock/phoenix.png"  }, platforms: ["ebay"],              supplier: "FormLabs TLV",    date: "2025-04-19", status: "issue",          total: 75.00  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_STATUSES: OrderStatus[] = ["in_production", "shipped", "delivered", "issue", "cancelled"];

const TABLE_COLUMNS = [
  { key: "order",    header: "Order #"  },
  { key: "product",  header: "Product"  },
  { key: "platform", header: "Platform" },
  { key: "supplier", header: "Supplier" },
  { key: "date",     header: "Date"     },
  { key: "status",   header: "Status"   },
  { key: "total",    header: "Total", align: "right" as const },
  { key: "action",   header: ""         },
];

const GRID_TEMPLATE = "0.7fr 1.8fr 1.1fr 1.4fr 1fr 1.2fr 0.65fr 32px";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCell({ product }: { product: SellerOrder["product"] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
        {imgError || !product.image ? (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={14} className="text-zinc-600" />
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
      <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-zinc-100">
        {product.name}
      </span>
    </div>
  );
}

function PlatformIcons({ platforms }: { platforms: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {platforms.map((p) => {
        const key = p.toLowerCase();
        const icon = PLATFORM_ICONS[key];
        const label = PLATFORM_LABELS[key] ?? p;
        if (icon) {
          return (
            <img key={p} src={icon} alt={label} title={label} className="h-5 w-5 object-contain" />
          );
        }
        return (
          <span
            key={p}
            className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-zinc-400"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerOrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockOrders.filter((o) => {
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.product.name.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

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
            <div className="flex items-center gap-3">
              <DashboardPageTitle>ORDERS</DashboardPageTitle>
              <span className="rounded-full border border-[#5ac422]/30 bg-[#5ac422]/15 px-2.5 py-0.5 text-[13px] font-bold text-[#5ac422]">
                {filtered.length}
              </span>
            </div>
          }
        >
          {/* ── Filters ─────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {(["all", ...FILTER_STATUSES] as string[]).map((s) => {
                const isActive = statusFilter === s;
                const label =
                  s === "all" ? "All" : ORDER_STATUS_CONFIG[s as OrderStatus]?.label ?? s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={[
                      "rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                      isActive
                        ? "border-[#5ac422] bg-[#5ac422]/15 text-[#5ac422]"
                        : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or order number…"
              className="min-w-[200px] flex-1 rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-[#5ac422]"
            />
          </div>

          {/* ── Table ───────────────────────────────────────────────────── */}
          <DashboardCard title="MY ORDERS" autoHeight>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No orders found.</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns={GRID_TEMPLATE}
                columns={TABLE_COLUMNS}
                rows={filtered}
                getRowKey={(o) => o.id}
                hoverable
                scrollable={false}
                onRowClick={(o) =>
                  navigate(`/dashboard/seller/orders/${o.id.replace("#", "")}`)
                }
                renderCell={(o, key) => {
                  if (key === "order") {
                    return (
                      <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">
                        {o.id}
                      </span>
                    );
                  }
                  if (key === "product") {
                    return <ProductCell product={o.product} />;
                  }
                  if (key === "platform") {
                    return <PlatformIcons platforms={o.platforms} />;
                  }
                  if (key === "supplier") {
                    return (
                      <span className="truncate text-[clamp(12px,1vw,14px)] text-zinc-200">
                        {o.supplier}
                      </span>
                    );
                  }
                  if (key === "date") {
                    return (
                      <span className="text-[11px] text-zinc-300">{formatDate(o.date)}</span>
                    );
                  }
                  if (key === "status") {
                    return <OrderStatusPill status={o.status} />;
                  }
                  if (key === "total") {
                    return (
                      <span className="text-[clamp(12px,1vw,14px)] font-semibold text-[#5ac422]">
                        ${o.total.toFixed(2)}
                      </span>
                    );
                  }
                  if (key === "action") {
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/seller/orders/${o.id.replace("#", "")}`);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-[#5ac422]/10 hover:text-[#5ac422]"
                        title="View order details"
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
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
