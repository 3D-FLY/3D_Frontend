import { NavLink } from "react-router-dom";

export type SidebarRole = "admin" | "seller";

interface NavItem {
  label: string;
  to: string;
}

interface SidebarProps {
  role: SidebarRole;
}

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

export default function Sidebar({ role }: SidebarProps) {
  const items = role === "admin" ? adminItems : sellerItems;

  return (
    <nav className="flex flex-col gap-1 w-full">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={
            item.to === "/dashboard/admin" ||
            item.to === "/dashboard/seller"
          }
          className={({ isActive }) =>
            [
              "group relative flex items-center w-full px-4 py-2",
              "text-[14px] leading-5 font-medium uppercase tracking-wide",
              "transition-all duration-200 rounded-md",

              isActive
                ? "bg-gray-100 text-black"
                : "text-gray-500 hover:text-black hover:bg-gray-50",
            ].join(" ")
          }
        >
          {/* Active indicator (פס בצד) */}
          <span
            className={`absolute left-0 top-0 h-full w-[3px] rounded-r-md transition-all ${
              location.pathname === item.to
                ? "bg-black opacity-100"
                : "opacity-0 group-hover:opacity-50"
            }`}
          />

          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}