import DashboardLayout from "../features/dashboard/DashboardLayout.js";
import DashboardCard from "../features/dashboard/components/DashboardCard.js";
import StatBlock from "../features/dashboard/components/StatBlock.js";
import StatusBadge from "../features/dashboard/components/StatusBadge.js";
import NotificationList from "../features/dashboard/components/NotificationList.js";

const notifications = [
  "#3012 - Supplier rejected order",
  "#3010 - Shipping delay",
  "#3008 - Order delivered",
  "#3007 - Order delivered",
  "Product #12 - Missing print settings",
  "#3002 - Dispute opened",
];

const topSellers = [
  { name: "Soldier", units: 48, revenue: "$2,400" },
  { name: "Spider Soldier", units: 36, revenue: "$1,800" },
  { name: "Dragon Figurine", units: 29, revenue: "$1,450" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="w-full space-y-6 box-border">
        {/* Welcome */}
        <h1 className="text-2xl font-bold text-white">Welcome, Raz</h1>

        {/* Status */}
        <DashboardCard title="Status">
          <div className="grid grid-cols-4 gap-4">
            <StatusBadge count={7594} label="Users" accentColor="green" />
            <StatusBadge count={57} label="Suppliers" accentColor="green" />
            <StatusBadge count={30125} label="Orders" accentColor="green" />
            <StatusBadge count={37} label="Issued" accentColor="yellow" />
          </div>
        </DashboardCard>

        {/* Notifications */}
        <DashboardCard title="Notification">
          <NotificationList items={notifications} />
        </DashboardCard>

        {/* Suppliers */}
        <DashboardCard title="Suppliers">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Find a Supplier
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select className="w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 pr-8 text-sm text-white outline-none focus:border-green-400 transition-colors">
                  <option value="">Select a supplier…</option>
                  <option value="1">Supplier A — Berlin, Germany</option>
                  <option value="2">Supplier B — Tel Aviv, Israel</option>
                  <option value="3">Supplier C — New York, US</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">
                  ▼
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Add", "Remove", "Edit", "Edit Map"].map((action) => (
                <button
                  key={action}
                  className="rounded-md bg-green-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-black transition-colors hover:bg-green-300"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </DashboardCard>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardCard title="Top Sellers">
            <div className="space-y-3">
              {topSellers.map((seller, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-zinc-900 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-zinc-400">
                      #{i + 1}
                    </span>
                    <span className="text-sm text-white">{seller.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">{seller.units} units</p>
                    <p className="text-sm font-semibold text-green-400">
                      {seller.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Find an Order">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Order # or customer name…"
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-green-400 transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <StatBlock
                  value="30,125"
                  label="Total Orders"
                  accentColor="white"
                />
                <StatBlock
                  value="37"
                  label="Open Issues"
                  accentColor="yellow"
                />
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
