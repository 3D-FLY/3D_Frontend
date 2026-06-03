import DashboardLayout from "../features/dashboard/DashboardLayout.js";
import DashboardCard from "../features/dashboard/components/DashboardCard.js";
import StatBlock from "../features/dashboard/components/StatBlock.js";
import StatusBadge from "../features/dashboard/components/StatusBadge.js";
import NotificationList from "../features/dashboard/components/NotificationList.js";
import type { Notification } from "../features/dashboard/components/NotificationList.js";
import ProductionCarousel from "../features/dashboard/components/ProductionCarousel.js";
import AnalyticsBar from "../features/dashboard/components/AnalyticsBar.js";
import type { AnalyticBlock } from "../features/dashboard/components/AnalyticsBar.js";

const analytics: AnalyticBlock[] = [
  {
    id: "1",
    value: "12",
    label: "Orders This Month",
    change: { percent: 12, label: "from last month" },
  },
  {
    id: "2",
    value: "17",
    label: "Products",
  },
  {
    id: "3",
    value: "$1,084",
    label: "Revenues",
    change: { percent: 76, label: "from last month" },
  },
];

const clipAnalyticsCard = analytics.length > 0;

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

const notifications: Notification[] = [
  { id: "1", orderId: "3012", message: "Supplier rejected order", type: "error", timestamp: new Date(Date.now() - 5 * 60000).toISOString(), link: "/seller/orders/3012" },
  { id: "2", orderId: "3010", message: "Shipping delay", type: "warning", timestamp: new Date(Date.now() - 18 * 60000).toISOString(), link: "/seller/orders/3010" },
  { id: "3", orderId: "3008", message: "Order delivered", type: "success", timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), link: "/seller/orders/3008" },
  { id: "4", orderId: "3007", message: "Order delivered", type: "success", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), link: "/seller/orders/3007" },
  { id: "5", orderId: "3005", message: "New order received", type: "info", timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), link: "/seller/orders/3005" },
];

export default function SellerDashboard() {
  return (
    <DashboardLayout role="seller">
      <div className="w-full space-y-6 box-border">
        {/* Welcome */}
        <h1 className="text-[clamp(22px,2.5vw,32px)] font-semibold text-white">Welcome, Raz</h1>

        {/* Analytics */}
        <DashboardCard
          title="Analytics"
          withBackground={false}
          clipContent={clipAnalyticsCard}
        >
          <AnalyticsBar items={analytics} />
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
