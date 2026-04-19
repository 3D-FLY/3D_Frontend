import { NavLink } from "react-router-dom";

export type SidebarRole = "admin" | "seller";

interface NavItem {
  label: string;
  to: string;
}

interface SidebarProps {
  role: SidebarRole;
  /** @deprecated no longer used — positioning is handled by DashboardLayout */
  bannerHeight?: number;
}

const adminItems: NavItem[] = [
  { label: "Home",      to: "/dashboard/admin" },
  { label: "Users",     to: "/dashboard/admin/users" },
  { label: "Suppliers", to: "/dashboard/admin/suppliers" },
  { label: "Orders",    to: "/dashboard/admin/orders" },
  { label: "Store",     to: "/dashboard/admin/store" },
  { label: "Settings",  to: "/dashboard/admin/settings" },
];

const sellerItems: NavItem[] = [
  { label: "My Store",    to: "/dashboard/seller" },
  { label: "Orders",      to: "/dashboard/seller/orders" },
  { label: "Products",    to: "/dashboard/seller/products" },
  { label: "Integration", to: "/dashboard/seller/integration" },
  { label: "Billing",     to: "/dashboard/seller/billing" },
  { label: "Settings",    to: "/dashboard/seller/settings" },
];

export default function Sidebar({ role }: SidebarProps) {
  const items = role === "admin" ? adminItems : sellerItems;

  return (
    <nav className="flex flex-col gap-4 w-full">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/dashboard/admin" || item.to === "/dashboard/seller"}
          className={({ isActive }) =>
            [
              "relative block w-full px-6 py-1 text-[22px] font-semibold uppercase tracking-wide transition-colors duration-300 ease-in-out",
              isActive
                ? "bg-gray-1000 pl-[22px] font-semibold text-black"
                : "pl-[22px] text-gray-1000 hover:text-white",
            ].join(" ")
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}