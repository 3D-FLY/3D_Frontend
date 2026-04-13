import { NavLink } from "react-router-dom";

export type SidebarRole = "admin" | "seller";

interface NavItem {
  label: string;
  to: string;
}

interface SidebarProps {
  role: SidebarRole;
  bannerHeight: number;
}

const NAVBAR_H = 72; // px — keep in sync with DashboardLayout

const adminItems: NavItem[] = [
  { label: "Home", to: "/dashboard/admin" },
  { label: "Users", to: "/dashboard/admin/users" },
  { label: "Suppliers", to: "/dashboard/admin/suppliers" },
  { label: "Orders", to: "/dashboard/admin/orders" },
  { label: "Store", to: "/dashboard/admin/store" },
  { label: "Settings", to: "/dashboard/admin/settings" },
];

const sellerItems: NavItem[] = [
  { label: "My Store", to: "/dashboard/seller" },
  { label: "Orders", to: "/dashboard/seller/orders" },
  { label: "Products", to: "/dashboard/seller/products" },
  { label: "Integration", to: "/dashboard/seller/integration" },
  { label: "Billing", to: "/dashboard/seller/billing" },
  { label: "Settings", to: "/dashboard/seller/settings" },
];

export default function Sidebar({ role, bannerHeight }: SidebarProps) {
  const items = role === "admin" ? adminItems : sellerItems;

  return (
    <aside
      className="fixed left-0 z-[100] flex w-48 flex-col overflow-y-auto bg-dark"
      style={{ top: NAVBAR_H, height: `calc(100vh - ${NAVBAR_H}px)` }}
    >
      {/* padding-top clears the banner that floats above */}
      <nav className="flex flex-col" style={{ paddingTop: bannerHeight }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard/admin" || item.to === "/dashboard/seller"}
            className={({ isActive }) =>
              [
                "relative px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors",
                isActive
                  ? "border-l-2 border-green-400 bg-zinc-700 pl-[22px] font-semibold text-white"
                  : "border-l-2 border-transparent pl-[22px] text-zinc-400 hover:bg-zinc-800 hover:text-white",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
