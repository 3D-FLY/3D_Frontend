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

const monthlyData = [
  { month: "Jan", revenue: 18400, commissions: 1840, payouts: 14200 },
  { month: "Feb", revenue: 21200, commissions: 2120, payouts: 16800 },
  { month: "Mar", revenue: 19800, commissions: 1980, payouts: 15100 },
  { month: "Apr", revenue: 24600, commissions: 2460, payouts: 19200 },
  { month: "May", revenue: 27100, commissions: 2710, payouts: 21300 },
  { month: "Jun", revenue: 31250, commissions: 3125, payouts: 24800 },
];

interface Transaction {
  id: string;
  date: string;
  store: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

const transactions: Transaction[] = [
  { id: "1", date: "2026-06-01", store: "Galaxy Toys",  amount: 1240, status: "paid"    },
  { id: "2", date: "2026-06-01", store: "Mini World",   amount: 860,  status: "pending" },
  { id: "3", date: "2026-05-30", store: "Print & Play", amount: 2100, status: "paid"    },
  { id: "4", date: "2026-05-29", store: "Galaxy Toys",  amount: 540,  status: "failed"  },
  { id: "5", date: "2026-05-28", store: "Mini World",   amount: 1750, status: "paid"    },
  { id: "6", date: "2026-05-27", store: "Print & Play", amount: 980,  status: "paid"    },
  { id: "7", date: "2026-05-26", store: "Galaxy Toys",  amount: 320,  status: "pending" },
  { id: "8", date: "2026-05-25", store: "Mini World",   amount: 1460, status: "paid"    },
];

interface Payout {
  id: string;
  supplier: string;
  completedOrders: number;
  amount: number;
  status: "paid" | "pending";
}

const initialPayouts: Payout[] = [
  { id: "1", supplier: "Alpha Print",  completedOrders: 42, amount: 7200, status: "paid"    },
  { id: "2", supplier: "Maker Hub",    completedOrders: 31, amount: 5100, status: "pending" },
  { id: "3", supplier: "3D Craft Co",  completedOrders: 28, amount: 4800, status: "paid"    },
  { id: "4", supplier: "PrintFast",    completedOrders: 19, amount: 3200, status: "pending" },
  { id: "5", supplier: "Fab Studio",   completedOrders: 26, amount: 4500, status: "paid"    },
];

const statCards = [
  { label: "Total Revenue This Month", value: "$31,250", color: "#5ac422" },
  { label: "Commissions Collected",    value: "$3,125",  color: "#22a8c4" },
  { label: "Supplier Payouts",         value: "$24,800", color: "#f87171" },
  { label: "Net Balance",              value: "$6,450",  color: "#a855f7" },
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
