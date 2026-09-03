import { useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import { type SupplierPayment } from "./mockSupplier.js";
import { mockOrders } from "../../../data/mockOrders.js";
import { CURRENT_SUPPLIER_ID } from "../../../data/currentUser.js";

const supplierOrders = mockOrders.filter((o) => o.supplierId === CURRENT_SUPPLIER_ID);

const now = new Date();
const isSameMonth = (iso: string) => {
  const d = new Date(iso);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
};

const totalEarned = supplierOrders
  .filter((o) => o.status === "delivered")
  .reduce((s, o) => s + o.supplierCost * o.quantity, 0);

const earnedThisMonth = supplierOrders
  .filter((o) => o.status === "delivered" && isSameMonth(o.createdAt))
  .reduce((s, o) => s + o.supplierCost * o.quantity, 0);

const pendingPayout = supplierOrders
  .filter((o) => o.status !== "delivered")
  .reduce((s, o) => s + o.supplierCost * o.quantity, 0);

const statCards = [
  { value: `$${totalEarned.toLocaleString()}`, label: "Total Earned", color: "#5ac422" },
  { value: `$${earnedThisMonth.toLocaleString()}`, label: "This Month", color: "#ffffff" },
  { value: `$${pendingPayout.toLocaleString()}`, label: "Pending Payout", color: "#facc15" },
];

const mockSupplierPayments: SupplierPayment[] = [...supplierOrders]
  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  .map((o) => ({
    orderId: o.id,
    date: o.createdAt.slice(0, 10),
    amount: `$${(o.supplierCost * o.quantity).toFixed(2)}`,
    status: o.status === "delivered" ? "paid" : "pending",
  }));

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const FALLBACK_EARNINGS = [320, 410, 380, 520, 470, 610, 540, 680];

const mockSupplierRevenue = (() => {
  const byMonth = new Map<string, { month: string; earnings: number }>();

  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" });
    byMonth.set(key, { month: label, earnings: 0 });
  }

  for (const o of supplierOrders) {
    const key = monthKey(o.createdAt);
    if (byMonth.has(key)) {
      byMonth.get(key)!.earnings += o.supplierCost * o.quantity;
    }
  }

  let i = 0;
  for (const point of byMonth.values()) {
    if (point.earnings === 0) point.earnings = FALLBACK_EARNINGS[i] ?? 300;
    i += 1;
  }

  return Array.from(byMonth.values());
})();

function PaymentStatusBadge({ status }: { status: SupplierPayment["status"] }) {
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SupplierPayments() {
  const [changingAccount, setChangingAccount] = useState(false);

  return (
    <DashboardLayout role="supplier">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage header={<DashboardPageTitle>REVENUES</DashboardPageTitle>}>
          {/* ── Stat cards ────────────────────────────────────────────────── */}
          <div className="grid min-h-[180px] w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {statCards.map((card) => (
              <StatusBadge key={card.label} count={card.value} label={card.label} color={card.color} />
            ))}
          </div>

          {/* ── Revenue chart ─────────────────────────────────────────────── */}
          <DashboardCard index={0} title="EARNINGS OVER TIME" autoHeight>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mockSupplierRevenue} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
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
                    return [`$${n.toLocaleString()}`, "Earnings"];
                  }}
                />
                <Line type="monotone" dataKey="earnings" stroke="#5ac422" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          {/* ── Payout method ─────────────────────────────────────────────── */}
          <DashboardCard index={1} title="PAYOUT METHOD" autoHeight withBackground={false}>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4">
              <div className="flex items-center gap-4">
                <Building2 size={24} className="shrink-0 text-white/40" />
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold text-white">
                    DE89 3704 0044 0532 0130 00
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-white/40">IBAN · Commerzbank Berlin</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                      SWIFT: COBADEFFXXX
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setChangingAccount(true);
                  setTimeout(() => setChangingAccount(false), 2000);
                }}
                className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/40 transition-colors hover:border-white/30 hover:text-white/70"
              >
                {changingAccount ? "Request Sent ✓" : "Change Account"}
              </button>
            </div>
          </DashboardCard>

          {/* ── Payment history ───────────────────────────────────────────── */}
          <DashboardCard index={2} title="PAYMENT HISTORY" autoHeight withBackground={false}>
            <DashboardTable
              variant="data"
              scrollable
              maxHeight={280}
              subtle
              columns={[
                { key: "orderId", header: "Order #" },
                { key: "date", header: "Date" },
                { key: "amount", header: "Amount" },
                { key: "action", header: "" },
              ]}
              rows={mockSupplierPayments}
              getRowKey={(p: SupplierPayment) => p.orderId}
              renderCell={(p: SupplierPayment, key: string) => {
                if (key === "orderId") return <span className="font-mono text-[12px] text-white/60">{p.orderId}</span>;
                if (key === "date") return formatDate(p.date);
                if (key === "amount") return <span className="font-semibold text-white">{p.amount}</span>;
                if (key === "status") return <PaymentStatusBadge status={p.status} />;
                return null;
              }}
            />
          </DashboardCard>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
