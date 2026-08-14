import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import { mockSupplierPayments, mockSupplierRevenue, type SupplierPayment } from "./mockSupplier.js";

const statCards = [
  { value: "$1,240", label: "Total Earned", color: "#5ac422" },
  { value: "$340", label: "This Month", color: "#ffffff" },
  { value: "$420", label: "Pending Payout", color: "#facc15" },
];

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
        <DashboardPage header={<DashboardPageTitle>PAYMENTS</DashboardPageTitle>}>
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
                <CreditCard size={24} className="shrink-0 text-white/40" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-semibold tracking-widest text-white">
                    •••• •••• 4242
                  </span>
                  <span className="text-[12px] text-white/40">Bank Transfer (IBAN)</span>
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
                {changingAccount ? "Request Sent" : "Change Account"}
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
                { key: "status", header: "Status" },
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
