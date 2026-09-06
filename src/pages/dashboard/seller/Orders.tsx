import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Package, MoreHorizontal } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import Modal from "../../../features/dashboard/components/Modal.js";
import { ORDER_STATUS_CONFIG, ORDER_STATUS_KEYS, type OrderStatusKey as OrderStatus } from "../../../constants/orderStatusConfig.js";
import { mockOrders as sharedOrders } from "../../../data/mockOrders.js";
import { mockProducts } from "../../../data/mockProducts.js";
import { mockSuppliers } from "../../../data/mockSuppliers.js";
import { CURRENT_SELLER_ID } from "../../../data/currentUser.js";
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
  platform: string;
  supplier: { city: string; country: string };
  date: string;
  status: OrderStatus;
  total: number;
}

// ─── Derived data ─────────────────────────────────────────────────────────────

const mockOrders: SellerOrder[] = sharedOrders
  .filter((o) => o.sellerId === CURRENT_SELLER_ID)
  .map((o) => {
    const product = mockProducts.find((p) => p.id === o.productId);
    const supplier = mockSuppliers.find((s) => s.id === o.supplierId);
    return {
      id: o.id,
      product: { name: product?.name ?? "Unknown", image: product?.image ?? "" },
      platform: o.platform,
      supplier: { city: supplier?.city ?? "Unknown", country: supplier?.country ?? "Unknown" },
      date: o.createdAt,
      status: o.status,
      total: o.sellerPrice * o.quantity,
    };
  });

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_STATUSES = ORDER_STATUS_KEYS.filter((s) => s !== "delivered");

const PAST_ORDERS_COLUMNS = [
  { key: "order",   header: "Order #" },
  { key: "product", header: "Product" },
  { key: "date",    header: "Date"    },
  { key: "total",   header: "Total", align: "right" as const },
  { key: "action",  header: ""       },
];

const PAST_ORDERS_GRID = "0.7fr 2.2fr 1fr 0.7fr 40px";

const TABLE_COLUMNS = [
  { key: "order",    header: "Order #"  },
  { key: "product",  header: "Product"  },
  { key: "platform", header: "Platform" },
  { key: "supplier", header: "Supplier Location" },
  { key: "date",     header: "Date"     },
  { key: "status",   header: "Status"   },
  { key: "total",    header: "Total", align: "right" as const },
  { key: "action",   header: ""         },
];

const GRID_TEMPLATE = "0.7fr 1.8fr 1.1fr 1.4fr 1fr 1.2fr 0.65fr 40px";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function formatSupplierLocation({ city, country }: { city: string; country: string }): string {
  return `${city}, ${country}`;
}

function ProductCell({ product }: { product: SellerOrder["product"] }) {
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
      <span className="truncate text-[clamp(12px,1vw,14px)] font-medium text-zinc-100">
        {product.name}
      </span>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  const icon = PLATFORM_ICONS[key];
  const label = PLATFORM_LABELS[key] ?? platform;

  if (icon) {
    return (
      <img src={icon} alt={label} title={label} className="h-5 w-5 object-contain" />
    );
  }

  return (
    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-zinc-400">
      {label}
    </span>
  );
}

function RowMenu({
  order,
  onViewOrder,
  onOpenDispute,
}: {
  order: SellerOrder;
  onViewOrder: () => void;
  onOpenDispute: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        title={`Order ${order.id} actions`}
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 min-w-[160px] rounded-xl border border-white/10 bg-[rgba(5,10,7,0.95)] py-1.5 shadow-xl">
          <div
            onClick={() => {
              setOpen(false);
              onViewOrder();
            }}
            className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            View Order <span>→</span>
          </div>
          <div
            onClick={() => {
              setOpen(false);
              onOpenDispute();
            }}
            className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-yellow-400 transition-colors hover:bg-white/[0.06] hover:text-yellow-300"
          >
            Open Dispute <span>⚑</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DisputeModal({
  order,
  disputeText,
  onChangeText,
  onClose,
  onSubmit,
}: {
  order: SellerOrder;
  disputeText: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal onClose={onClose} size="sm">
      <h2 className="text-lg font-extrabold uppercase italic tracking-wide text-white">
        Open Dispute
      </h2>

      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-white/40">Order</span>
          <span className="text-sm text-white">{order.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-white/40">Product</span>
          <span className="text-sm text-white">{order.product.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-white/40">Status</span>
          <OrderStatusPill status={order.status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-white/40">Total</span>
          <span className="text-sm text-white">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-white/10" />

      <div className="flex flex-col gap-2">
        <label className="text-[11px] uppercase tracking-wider text-white/40">
          Describe the issue
        </label>
        <textarea
          value={disputeText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Please describe the issue with this order in detail..."
          rows={5}
          className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-wider placeholder:text-white/25 transition-colors focus:border-yellow-400/40"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/50 transition-colors hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!disputeText.trim()}
          onClick={onSubmit}
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-extrabold italic uppercase tracking-wide text-black transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
        >
          Submit Dispute
        </button>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerOrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const statusFilter =
    statusParam && (ORDER_STATUS_KEYS as readonly string[]).includes(statusParam)
      ? statusParam
      : "all";
  const [search, setSearch]           = useState("");
  const [disputeOrder, setDisputeOrder] = useState<SellerOrder | null>(null);
  const [disputeText, setDisputeText]   = useState("");

  const setStatusFilter = (s: string) => {
    const next = new URLSearchParams(searchParams);
    if (s === "all") next.delete("status");
    else next.set("status", s);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockOrders.filter((o) => {
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.product.name.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus && o.status !== "delivered";
    });
  }, [search, statusFilter]);

  const pastOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockOrders.filter((o) => {
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.product.name.toLowerCase().includes(q);
      return matchSearch && o.status === "delivered";
    });
  }, [search]);

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
                      "relative rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                      isActive
                        ? "text-[#5ac422]"
                        : "border border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="seller-orders-active-pill"
                        className="absolute inset-0 rounded-full border border-[#5ac422]/40 bg-[#5ac422]/15"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
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
                    return <PlatformIcon platform={o.platform} />;
                  }
                  if (key === "supplier") {
                    return (
                      <span className="truncate text-[clamp(12px,1vw,14px)] text-zinc-200">
                        {formatSupplierLocation(o.supplier)}
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
                      <RowMenu
                        order={o}
                        onViewOrder={() =>
                          navigate(`/dashboard/seller/orders/${o.id.replace("#", "")}`)
                        }
                        onOpenDispute={() => {
                          setDisputeOrder(o);
                          setDisputeText("");
                        }}
                      />
                    );
                  }
                  return null;
                }}
              />
            )}
          </DashboardCard>

          {/* ── Past Orders — everything marked DONE ───────────────────── */}
          <DashboardCard title="Print History" autoHeight>
            {pastOrders.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No past orders yet.</p>
            ) : (
              <DashboardTable
                variant="list"
                gridTemplateColumns={PAST_ORDERS_GRID}
                columns={PAST_ORDERS_COLUMNS}
                rows={pastOrders}
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
                  if (key === "date") {
                    return (
                      <span className="text-[11px] text-zinc-300">{formatDate(o.date)}</span>
                    );
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
                      <RowMenu
                        order={o}
                        onViewOrder={() =>
                          navigate(`/dashboard/seller/orders/${o.id.replace("#", "")}`)
                        }
                        onOpenDispute={() => {
                          setDisputeOrder(o);
                          setDisputeText("");
                        }}
                      />
                    );
                  }
                  return null;
                }}
              />
            )}
          </DashboardCard>
        </DashboardPage>
      </motion.div>

      {disputeOrder && (
        <DisputeModal
          order={disputeOrder}
          disputeText={disputeText}
          onChangeText={setDisputeText}
          onClose={() => {
            setDisputeOrder(null);
            setDisputeText("");
          }}
          onSubmit={() => {
            setDisputeOrder(null);
            setDisputeText("");
          }}
        />
      )}
    </DashboardLayout>
  );
}
