import DashboardLayout from "../features/dashboard/DashboardLayout.js";
import DashboardCard from "../features/dashboard/components/DashboardCard.js";
import StatBlock from "../features/dashboard/components/StatBlock.js";
import StatusBadge from "../features/dashboard/components/StatusBadge.js";
import NotificationList from "../features/dashboard/components/NotificationList.js";
import ProductionCarousel from "../features/dashboard/components/ProductionCarousel.js";

const productionItems = [
  {
    name: "Soldier",
    image: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=200&q=80",
    location: "Berlin, Germany",
  },
  {
    name: "Spider Soldier",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    location: "Tel Aviv, Israel",
  },
  {
    name: "Bird",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&q=80",
    location: "New York, US",
  },
  {
    name: "Metal Soldier",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=200&q=80",
    location: "Santiago, Chile",
  },
  {
    name: "Deer",
    image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=200&q=80",
    location: "Berlin, Germany",
  },
];

const notifications = [
  "#3012 - Supplier rejected order",
  "#3010 - Shipping delay",
  "#3008 - Order delivered",
  "#3007 - Order delivered",
  "#3005 - New order received",
  "#3012 - Supplier rejected order",
  "#3010 - Shipping delay",
  "#3008 - Order delivered",
  "#3007 - Order delivered",
  "#3005 - New order received",
];

export default function SellerDashboard() {
  return (
    <DashboardLayout role="seller">
      <div className="w-full space-y-6 box-border">
        {/* Welcome */}
        <h1 className="text-[clamp(22px,2.5vw,32px)] font-semibold text-white">Welcome, Raz</h1>

        {/* Analytics */}
        <DashboardCard title="Analytics">
          <div className="grid grid-cols-3 divide-x divide-zinc-700">
            <StatBlock
              value={12}
              label="Orders this month"
              subLabel="+12% from last month"
              accentColor="white"
            />
            <StatBlock
              value={17}
              label="Products"
              accentColor="white"
            />
            <StatBlock
              value="$1084"
              label="Revenues"
              subLabel="+76% from last month"
              accentColor="white"
            />
          </div>
        </DashboardCard>

        {/* Order Status */}
        <DashboardCard title="Order Status">
          <div className="grid grid-cols-4 gap-4">
            <StatusBadge count={7} label="Printing" accentColor="green" />
            <StatusBadge count={4} label="Shipped" accentColor="green" />
            <StatusBadge count={34} label="Delivered" accentColor="green" />
            <StatusBadge count={1} label="Issued" accentColor="yellow" />
          </div>
        </DashboardCard>

        {/* Orders in Production */}
        <DashboardCard title="Orders in Production">
          <ProductionCarousel items={productionItems} />
        </DashboardCard>

        {/* Bottom row: Top Sellers + Notifications */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardCard title="Top Sellers">
            <div className="flex items-start gap-4 rounded-lg bg-zinc-900 p-4">
              <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=200&q=80"
                  alt="Top seller"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">
                  Orders:
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Soldier</p>
                <p className="mt-0.5 text-xs text-zinc-500">48 units sold</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Notification">
            <NotificationList items={notifications} />
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
