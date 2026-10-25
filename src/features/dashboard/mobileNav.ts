import type { SidebarRole } from "./components/Sidebar.js";

/**
 * Mobile shell config (below `md`), one entry per role.
 * - `bottomBar`: route paths of existing sidebar items, in display order. Label and icon
 *   come from the sidebar item, so reordering this array is the only change needed.
 * - `profileMenu`: same, plus the special keys "profile" and "signout".
 * - `null`: the role's mobile design isn't ready yet, so it keeps the desktop layout at every width.
 */
export type ProfileMenuKey = "profile" | "signout" | (string & {});

export interface MobileNavConfig {
  bottomBar: string[];
  profileMenu: ProfileMenuKey[];
}

export const MOBILE_NAV: Record<SidebarRole, MobileNavConfig | null> = {
  admin: {
    bottomBar: [
      "/dashboard/admin/notifications",
      "/dashboard/admin/orders",
      "/dashboard/admin/suppliers",
      "/dashboard/admin/users",
      "/dashboard/admin",
    ],
    profileMenu: ["profile", "/dashboard/admin/payments", "/dashboard/admin/settings", "signout"],
  },
  seller: null, // to be designed
  supplier: null, // to be designed
};
