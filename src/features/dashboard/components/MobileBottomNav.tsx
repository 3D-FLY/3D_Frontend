import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getNewNotificationsCount, NOTIFICATIONS_UPDATED_EVENT } from "../../../data/mockNotifications.js";
import { getNavItems, isRoleHome, roleInboxPath, type NavItem, type SidebarRole } from "./Sidebar.js";

export const MOBILE_BOTTOM_NAV_H = 64;

interface MobileBottomNavProps {
  role: SidebarRole;
  /** Route paths of sidebar items, in display order (from MOBILE_NAV). */
  items: string[];
  className?: string;
}

export default function MobileBottomNav({ role, items, className = "" }: MobileBottomNavProps) {
  const navItems = getNavItems(role);
  const resolved = items
    .map((to) => navItems.find((i) => i.to === to))
    .filter((i): i is NavItem => i !== undefined);

  const [unreadCount, setUnreadCount] = useState(() => getNewNotificationsCount(role));

  useEffect(() => {
    const refresh = () => setUnreadCount(getNewNotificationsCount(role));
    refresh();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
  }, [role]);

  return (
    <nav
      className={`fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-dark ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="m-0 flex list-none items-stretch justify-around p-0" style={{ height: MOBILE_BOTTOM_NAV_H }}>
        {resolved.map((item) => {
          const Icon = item.icon;
          const showBadge = item.to === roleInboxPath(role) && unreadCount > 0;
          return (
            <li key={item.to} className="flex min-w-0 flex-1">
              <NavLink
                to={item.to}
                end={isRoleHome(item.to)}
                className={({ isActive }) =>
                  [
                    "flex min-h-[44px] w-full flex-col items-center justify-center gap-1 px-1",
                    "text-[10px] font-medium uppercase tracking-wide transition-colors",
                    isActive ? "text-green-500" : "text-zinc-400 hover:text-zinc-200",
                  ].join(" ")
                }
              >
                <span className="relative">
                  <Icon size={20} />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-black">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
