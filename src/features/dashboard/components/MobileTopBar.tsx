import { LogOut, User } from "lucide-react";
import LogoSvg from "../../../assets/icons/logo.svg?react";
import { getNavItems, roleLabels, type SidebarRole } from "./Sidebar.js";
import UserMenu, { type UserMenuItem } from "./UserMenu.js";
import type { ProfileMenuKey } from "../mobileNav.js";

export const MOBILE_TOPBAR_H = 56;

/** Maps profile-menu config keys to menu items; route keys reuse the sidebar item's label and icon. */
function resolveProfileMenu(role: SidebarRole, keys: ProfileMenuKey[]): UserMenuItem[] {
  const navItems = getNavItems(role);
  return keys.flatMap((key): UserMenuItem[] => {
    if (key === "profile") return [{ label: "Profile", to: `/dashboard/${role}/settings`, icon: User }];
    if (key === "signout") return [{ label: "Sign out", to: "/login", icon: LogOut, danger: true }];
    const item = navItems.find((i) => i.to === key);
    return item ? [{ label: item.label, to: item.to, icon: item.icon }] : [];
  });
}

interface MobileTopBarProps {
  role: SidebarRole;
  profileMenu: ProfileMenuKey[];
  className?: string;
}

export default function MobileTopBar({ role, profileMenu, className = "" }: MobileTopBarProps) {
  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between gap-3 bg-dark px-4 ${className}`}
      style={{ height: MOBILE_TOPBAR_H }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <LogoSvg className="h-10 w-auto shrink-0 text-green-500" aria-label="3D-Fly logo" />
        <span className="truncate font-sans text-xl font-extrabold italic leading-none text-white">
          {roleLabels[role]}
        </span>
      </div>
      <UserMenu role={role} items={resolveProfileMenu(role, profileMenu)} />
    </header>
  );
}
