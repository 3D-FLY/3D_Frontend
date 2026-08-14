import { CreditCard, Download, Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon      from "../../../assets/icons/shops/amazon-icon.svg?url";
import etsyIcon        from "../../../assets/icons/shops/etsy-icon.svg?url";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";

// ─── Mock data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", shopify: 320, ebay: 180, woocommerce:  90, wix:  60, amazon: 210, etsy:  45 },
  { month: "Feb", shopify: 410, ebay: 220, woocommerce: 140, wix:  80, amazon: 270, etsy:  60 },
  { month: "Mar", shopify: 380, ebay: 195, woocommerce: 110, wix:  70, amazon: 240, etsy:  55 },
  { month: "Apr", shopify: 520, ebay: 260, woocommerce: 180, wix: 100, amazon: 310, etsy:  80 },
  { month: "May", shopify: 610, ebay: 290, woocommerce: 200, wix: 120, amazon: 360, etsy:  95 },
  { month: "Jun", shopify: 680, ebay: 310, woocommerce: 240, wix: 140, amazon: 400, etsy: 110 },
];

const CHART_PLATFORMS = [
  { key: "shopify",     name: "Shopify",     color: "#5ac422", icon: shopifyIcon     },
  { key: "ebay",        name: "eBay",        color: "#3b82f6", icon: ebayIcon        },
  { key: "woocommerce", name: "WooCommerce", color: "#a855f7", icon: woocommerceIcon },
  { key: "wix",         name: "Wix",         color: "#22a8c4", icon: wixIcon         },
  { key: "amazon",      name: "Amazon",      color: "#f97316", icon: amazonIcon      },
  { key: "etsy",        name: "Etsy",        color: "#f87171", icon: etsyIcon        },
];

const productOrdersData = [
  { name: "SoldierXPT", orders: 34, color: "#5ac422" },
  { name: "WarriorX",   orders: 21, color: "#3b82f6" },
  { name: "DragonMini", orders: 18, color: "#a855f7" },
  { name: "RocketBase", orders: 12, color: "#f97316" },
  { name: "MechBot",    orders:  9, color: "#22a8c4" },
];

type InvoiceStatus = "paid" | "pending";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
}

const mockInvoices: Invoice[] = [
  { id: "INV-006", date: "2025-06-01", amount: "$49.00", status: "paid" },
  { id: "INV-005", date: "2025-05-01", amount: "$49.00", status: "paid" },
  { id: "INV-004", date: "2025-04-01", amount: "$49.00", status: "paid" },
  { id: "INV-003", date: "2025-03-01", amount: "$29.00", status: "paid" },
  { id: "INV-002", date: "2025-02-01", amount: "$29.00", status: "paid" },
];

const PLAN_FEATURES = [
  "Up to 500 orders/month",
  "All platform integrations",
  "Priority support",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const primaryStatCards = [
  { value: "12",     label: "Orders",         color: "#ffffff"  },
  { value: "$1,084", label: "Total Payments", color: "#5ac422"  },
  { value: "$976",   label: "Profits",        color: "#22a8c4"  },
];

function ProductTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  return (
    <text
      x={x}
      y={(y ?? 0) + 16}
      textAnchor="middle"
      fill="rgba(255,255,255,0.4)"
      fontSize={11}
    >
      {payload?.value}
    </text>
  );
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  if (status === "paid") {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-green-500">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Paid
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-yellow-400">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
      Pending
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  return (
    <DashboardLayout role="seller">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage header={<DashboardPageTitle>BILLING</DashboardPageTitle>}>

          {/* ── Section 1a — Primary stats ──────────────────────────────── */}
          <div className="grid min-h-[180px] w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {primaryStatCards.map((card) => (
              <StatusBadge key={card.label} count={card.value} label={card.label} color={card.color} />
            ))}
          </div>

          {/* ── Section 2 — Revenue Chart ────────────────────────────────── */}
          <DashboardCard index={0} title="REVENUE BY PLATFORM" autoHeight>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={revenueData}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1a10",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "white", fontSize: 12, fontWeight: 600 }}
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0);
                    return [`$${n.toLocaleString()}`, undefined];
                  }}
                />
                {CHART_PLATFORMS.map((p) => (
                  <Line key={p.key} type="monotone" dataKey={p.key} name={p.name}
                    stroke={p.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Custom legend with platform icons */}
            <div className="mt-4 flex flex-wrap items-end justify-center gap-5">
              {CHART_PLATFORMS.map((p) => (
                <div key={p.key} className="flex flex-col items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <img src={p.icon} alt={p.name} className="h-5 w-5 object-contain" />
                  <span className="text-[10px] text-zinc-500">{p.name}</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* ── Section 2b — Product Orders Chart ──────────────────────────── */}
          <DashboardCard index={1} title="ORDERS BY PRODUCT" autoHeight>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={productOrdersData}
                barSize={36}
                barCategoryGap="20%"
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={<ProductTick />}
                  axisLine={false}
                  tickLine={false}
                  height={32}
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1a10",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "white", fontSize: 12, fontWeight: 600 }}
                  formatter={(value) => [`${value} orders`, undefined]}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                  {productOrdersData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          {/* ── Section 3 + 4 — Plan + Payment Method (side by side) ─────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <DashboardCard index={2} title="MY PLAN" autoHeight withBackground={false}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold uppercase tracking-wide text-green-500">
                    Pro Plan
                  </span>
                  <span className="text-base font-semibold text-white">$0 / month</span>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={14} className="shrink-0 text-green-500" strokeWidth={2.5} />
                      <span className="text-sm text-white/70">{f}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <button
                    type="button"
                    className="rounded-md border border-green-500/40 px-5 py-2 text-[13px] font-bold uppercase italic tracking-wide text-green-500 transition-colors hover:bg-green-500/10"
                  >
                    Upgrade to Enterprise
                  </button>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard index={3} title="PAYMENT METHOD" autoHeight withBackground={false}>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4">
                <div className="flex items-center gap-4">
                  <CreditCard size={24} className="shrink-0 text-white/40" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-semibold tracking-widest text-white">
                      •••• •••• •••• 4242
                    </span>
                    <span className="text-[12px] text-white/40">Visa · Expires 12/26</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/40 transition-colors hover:border-white/30 hover:text-white/70"
                >
                  Change Card
                </button>
              </div>
            </DashboardCard>
          </div>

          {/* ── Section 5 — Invoice History ──────────────────────────────── */}
          <DashboardCard index={4} title="INVOICES" autoHeight withBackground={false}>
            <DashboardTable
              variant="data"
              scrollable
              maxHeight={280}
              subtle
              columns={[
                { key: "id",       header: "Invoice"  },
                { key: "date",     header: "Date"     },
                { key: "amount",   header: "Amount"   },
                { key: "status",   header: "Status"   },
                { key: "download", header: "Download" },
              ]}
              rows={mockInvoices}
              getRowKey={(inv: Invoice) => inv.id}
              renderCell={(inv: Invoice, key: string) => {
                if (key === "id")     return <span className="font-mono text-[12px] text-white/60">{inv.id}</span>;
                if (key === "date")   return inv.date;
                if (key === "amount") return <span className="font-semibold text-white">{inv.amount}</span>;
                if (key === "status") return <InvoiceStatusBadge status={inv.status} />;
                if (key === "download") {
                  return (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/50 transition-colors hover:border-white/30 hover:text-white"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  );
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
