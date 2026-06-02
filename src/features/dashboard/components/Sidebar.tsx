import { NavLink } from "react-router-dom";
import { type LucideIcon, LayoutDashboard, Users, Truck, MapPin, ShoppingCart, Store, Settings, Package, Plug, CreditCard } from "lucide-react";

export type SidebarRole = "admin" | "seller";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarProps {
  role: SidebarRole;
}

const adminItems: NavItem[] = [
  { label: "Home",         to: "/dashboard/admin",              icon: LayoutDashboard },
  { label: "Users",        to: "/dashboard/admin/users",        icon: Users           },
  { label: "Suppliers",    to: "/dashboard/admin/suppliers",    icon: Truck           },
  { label: "Supplier Map", to: "/dashboard/admin/supplier-map", icon: MapPin          },
  { label: "Orders",       to: "/dashboard/admin/orders",       icon: ShoppingCart    },
  { label: "Store",        to: "/dashboard/admin/stores",        icon: Store           },
  { label: "Settings",     to: "/dashboard/admin/settings",     icon: Settings        },
];

const sellerItems: NavItem[] = [
  { label: "My Store",    to: "/dashboard/seller",             icon: Store           },
  { label: "Orders",      to: "/dashboard/seller/orders",      icon: ShoppingCart    },
  { label: "Products",    to: "/dashboard/seller/products",    icon: Package         },
  { label: "Integration", to: "/dashboard/seller/integration", icon: Plug            },
  { label: "Billing",     to: "/dashboard/seller/billing",     icon: CreditCard      },
  { label: "Settings",    to: "/dashboard/seller/settings",    icon: Settings        },
];

export default function Sidebar({ role }: SidebarProps) {
  const items = role === "admin" ? adminItems : sellerItems;

  return (
    <nav className="flex flex-col gap-1 w-full">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={
              item.to === "/dashboard/admin" ||
              item.to === "/dashboard/seller"
            }
            className={({ isActive }) =>
              [
                "group relative flex items-center gap-2.5 w-full px-4 py-2",
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

            <Icon size={16} className="shrink-0" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}