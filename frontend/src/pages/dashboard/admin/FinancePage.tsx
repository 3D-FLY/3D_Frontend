import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Check } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import { mockOrders } from "../../../data/mockOrders.js";
import { mockSellers } from "../../../data/mockSellers.js";
import { mockSuppliers } from "../../../data/mockSuppliers.js";
import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
}

function monthLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short" });
}

const monthlyData = (() => {
  const byMonth = new Map<string, { month: string; revenue: number; commissions: number; payouts: number }>();
  for (const o of mockOrders) {
    const key = monthKey(o.createdAt);
    if (!byMonth.has(key)) {
      byMonth.set(key, { month: monthLabel(o.createdAt), revenue: 0, commissions: 0, payouts: 0 });
    }
    const entry = byMonth.get(key)!;
    entry.revenue += o.sellerPrice * o.quantity;
    entry.commissions += o.platformFee;
    entry.payouts += o.supplierCost * o.quantity;
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([, v]) => v);
})();

interface Transaction {
  id: string;
  date: string;
  store: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

const TX_STATUS_MAP: Record<OrderStatusKey, Transaction["status"]> = {
  pending: "pending",
  accepted: "pending",
  in_production: "paid",
  ready: "paid",
  shipped: "paid",
  delivered: "paid",
  issue: "failed",
  cancelled: "failed",
};

const transactions: Transaction[] = [...mockOrders]
  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  .map((o) => ({
    id: o.id,
    date: o.createdAt.slice(0, 10),
    store: mockSellers.find((s) => s.id === o.sellerId)?.name ?? "Unknown",
    amount: o.sellerPrice * o.quantity,
    status: TX_STATUS_MAP[o.status],
  }));

interface Payout {
  id: string;
  supplier: string;
  completedOrders: number;
  amount: number;
  status: "paid" | "pending";
}

const initialPayouts: Payout[] = mockSuppliers
  .map((s) => {
    const supplierOrders = mockOrders.filter((o) => o.supplierId === s.id);
    const completedOrders = supplierOrders.filter(
      (o) => o.status === "delivered" || o.status === "shipped",
    ).length;
    const amount = supplierOrders.reduce((sum, o) => sum + o.supplierCost * o.quantity, 0);
    const hasPending = supplierOrders.some((o) => o.status === "pending" || o.status === "accepted" || o.status === "in_production");
    return {
      id: s.id,
      supplier: s.name,
      completedOrders,
      amount,
      status: hasPending ? ("pending" as const) : ("paid" as const),
    };
  })
  .filter((p) => p.amount > 0);

const totalRevenue = mockOrders.reduce((s, o) => s + o.sellerPrice * o.quantity, 0);
const totalCommissions = mockOrders.reduce((s, o) => s + o.platformFee, 0);
const totalPayouts = mockOrders.reduce((s, o) => s + o.supplierCost * o.quantity, 0);

const statCards = [
  { label: "Total Revenue",     value: `$${totalRevenue.toLocaleString()}`,     color: "#5ac422" },
  { label: "Commissions Collected", value: `$${totalCommissions.toLocaleString()}`, color: "#22a8c4" },
  { label: "Supplier Payouts",  value: `$${totalPayouts.toLocaleString()}`,     color: "#f87171" },
  { label: "Net Balance",       value: `$${totalCommissions.toLocaleString()}`, color: "#a855f7" },
];

const txStatusClass: Record<Transaction["status"], string> = {
  paid:    "bg-[#5ac422]/15 text-[#5ac422] border border-[#5ac422]/30",
  pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  failed:  "bg-red-500/15 text-[#f87171] border border-red-500/30",
};

type Filter = "6M" | "1Y" | "All";

export default function FinancePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("6M");
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);

  const markPaid = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" as const } : p))
    );
  };

  return (
    <DashboardLayout role="admin">
      <DashboardPage title="Payments">
        {/* SECTION 1 — Stat Cards */}
        <div className="grid min-h-[180px] w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatusBadge key={card.label} count={card.value} label={card.label} color={card.color} />
          ))}
        </div>

        {/* SECTION 2 — Revenue Chart */}
        <DashboardCard
          index={0}
          title="Revenue Overview"
          autoHeight
          headerAction={
            <div className="flex gap-1">
              {(["6M", "1Y", "All"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                    activeFilter === f
                      ? "bg-[#5ac422] text-black"
                      : "border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={monthlyData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
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
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
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
              <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#5ac422"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="commissions"
                name="Commissions"
                stroke="#22a8c4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="payouts"
                name="Payouts"
                stroke="#f87171"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>

        {/* SECTION 3 — Two Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT — Recent Transactions */}
          <DashboardCard index={1} title="Recent Transactions" autoHeight>
            <DashboardTable
              variant="data"
              scrollable
              maxHeight={300}
              columns={[
                { key: "date", header: "Date" },
                { key: "store", header: "Store" },
                { key: "amount", header: "Amount" },
                { key: "status", header: "Status" },
              ]}
              rows={transactions}
              getRowKey={(tx) => tx.id}
              renderCell={(tx, key) => {
                if (key === "date") return tx.date;
                if (key === "store") return tx.store;
                if (key === "amount") return `$${tx.amount.toLocaleString()}`;
                if (key === "status") {
                  return (
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${txStatusClass[tx.status]}`}>
                      {tx.status}
                    </span>
                  );
                }
                return null;
              }}
            />
          </DashboardCard>

          {/* RIGHT — Supplier Payouts */}
          <DashboardCard index={2} title="Supplier Payouts" autoHeight>
            <DashboardTable
              variant="data"
              scrollable
              maxHeight={300}
              columns={[
                { key: "supplier", header: "Supplier" },
                { key: "orders", header: "Orders" },
                { key: "amount", header: "Amount" },
                { key: "action", header: "Action" },
              ]}
              rows={payouts}
              getRowKey={(p) => p.id}
              renderCell={(p, key) => {
                if (key === "supplier") return p.supplier;
                if (key === "orders") return p.completedOrders;
                if (key === "amount") return `$${p.amount.toLocaleString()}`;
                if (key === "action") {
                  return p.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => markPaid(p.id)}
                      className="rounded border border-[#5ac422]/40 px-2.5 py-1 text-[11px] font-semibold text-[#5ac422] transition-colors hover:bg-[#5ac422]/10"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <Check size={16} color="#5ac422" />
                  );
                }
                return null;
              }}
            />
          </DashboardCard>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}
