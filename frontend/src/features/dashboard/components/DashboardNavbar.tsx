import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, LogOut } from "lucide-react";
import LogoSvg from "../../../assets/icons/logo.svg?react";
import GlobalIcon from "../../../components/icons/GlobalIcon.js";
import { getNewNotificationsCount, NOTIFICATIONS_UPDATED_EVENT } from "../../../data/mockNotifications.js";
import type { SidebarRole } from "./Sidebar.js";
import { roleInboxPath } from "./Sidebar.js";

function BellIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.3654 21.252L26.8987 18.8173C26.5907 18.2747 26.312 17.248 26.312 16.6467V12.936C26.312 9.48935 24.288 6.51202 21.3694 5.11868C20.6067 3.76935 19.1987 2.93335 17.5854 2.93335C15.9867 2.93335 14.5494 3.79868 13.7867 5.16268C10.9267 6.58535 8.94671 9.53335 8.94671 12.936V16.6467C8.94671 17.248 8.66805 18.2747 8.36005 18.8027L6.87871 21.252C6.29205 22.2347 6.16005 23.32 6.52671 24.3174C6.87871 25.3 7.71471 26.0627 8.80005 26.4293C11.6454 27.3974 14.6374 27.8667 17.6294 27.8667C20.6214 27.8667 23.6134 27.3974 26.4587 26.444C27.4854 26.1067 28.2774 25.3293 28.6587 24.3174C29.04 23.3053 28.9374 22.1907 28.3654 21.252Z" fill="#5AC422"/>
      <path d="M21.7505 29.348C21.1345 31.0494 19.5065 32.2667 17.5999 32.2667C16.4412 32.2667 15.2972 31.7974 14.4905 30.9614C14.0212 30.5214 13.6692 29.9347 13.4639 29.3334C13.6545 29.3627 13.8452 29.3774 14.0505 29.4067C14.3879 29.4507 14.7399 29.4947 15.0919 29.524C15.9279 29.5974 16.7785 29.6414 17.6292 29.6414C18.4652 29.6414 19.3012 29.5974 20.1225 29.524C20.4305 29.4947 20.7385 29.48 21.0319 29.436C21.2665 29.4067 21.5012 29.3774 21.7505 29.348Z" fill="#5AC422"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.87239 0.0378497C4.40482 0.416492 1.89197 3.54094 2.26998 7.00272C2.42806 8.45041 3.06812 9.72959 4.01196 10.7023L0.175228 15.4715C-0.0996142 15.8132 -0.0451179 16.3123 0.296894 16.5858C0.467942 16.7229 0.677819 16.7775 0.880106 16.7554C1.08239 16.7333 1.27554 16.6347 1.41296 16.4639L5.2497 11.6947C6.40485 12.4048 7.79408 12.7518 9.24419 12.5935C12.7118 12.2148 15.2246 9.0904 14.8467 5.6294C14.4688 2.16839 11.34 -0.340793 7.87316 0.0377651L7.87239 0.0378497ZM9.07131 11.0174C6.47412 11.301 4.13102 9.42248 3.84789 6.82963C3.56477 4.23678 5.44723 1.89682 8.04441 1.61322C10.6416 1.32961 12.9847 3.20816 13.2678 5.80102C13.551 8.39387 11.6685 10.7338 9.07131 11.0174Z" fill="#959595"/>
    </svg>
  );
}

const DROPDOWN_USER: Record<SidebarRole, { name: string; email: string; initials: string; plan: string }> = {
  admin:    { name: "Raz Malka",   email: "raz@3dfly.io",    initials: "RM", plan: "Super Admin" },
  seller:   { name: "Raz Store",   email: "raz@3dfly.com",   initials: "RS", plan: "Pro Plan"    },
  supplier: { name: "David Print", email: "david@printlab.io", initials: "DP", plan: "Supplier"  },
};

function UserDropdown({ role }: { role: SidebarRole }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = DROPDOWN_USER[role];

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative not-italic">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20 text-sm font-bold text-green-500 transition-colors hover:bg-green-500/30"
        aria-label="Profile"
      >
        {user.initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-11 z-50 w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,18,12,0.97)] shadow-2xl backdrop-blur-md"
          >
            {/* User info */}
            <div className="border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20 text-sm font-bold text-green-500">
                  {user.initials}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-white">{user.name}</span>
                  <span className="truncate text-[11px] text-white/40">{user.email}</span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-green-500">{user.plan}</span>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <button
                type="button"
                onClick={() => {
                  navigate(`/dashboard/${role}/settings`);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Settings size={15} />
                Account Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-400/5 hover:text-red-300"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DashboardNavbarProps {
  role: SidebarRole;
}

export default function DashboardNavbar({ role }: DashboardNavbarProps) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(() => getNewNotificationsCount(role));

  useEffect(() => {
    const refresh = () => setUnreadCount(getNewNotificationsCount(role));
    refresh();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
  }, [role]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-[72px] items-center justify-between bg-dark px-5 italic">
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <LogoSvg className="h-[56px] w-auto py-1 text-green" aria-label="3D-Fly logo" />
        <span className="font-sans text-4xl font-extrabold italic leading-none select-none whitespace-nowrap text-gray">
          3D-Fly
        </span>
      </div>

      {/* Search bar — green pill, matching Figma */}
      <form
        className="relative mx-8 hidden h-[31px] w-[201px] shrink-0 sm:block"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex h-full w-full items-center overflow-hidden rounded-[18px] border-[2.5px] border-green bg-green">
          <input
            type="text"
            placeholder="SEARCH"
            className="h-full flex-1 bg-transparent pl-4 text-[11px] font-medium italic text-dark placeholder:text-dark/90 outline-none tracking-wide uppercase"
          />
          {/* Search button — circle inside the pill on the right */}
          <button
            type="submit"
            aria-label="Search"
            className="flex h-full aspect-square shrink-0 items-center justify-center rounded-full bg-dark transition-opacity hover:opacity-75"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {/* Right icons */}
      <div className="flex flex-shrink-0 items-center gap-2 pr-3">
        <Link
          to={`/dashboard/${role}/map`}
          className="flex items-center justify-center rounded-full p-1 transition-opacity hover:opacity-70"
          aria-label="Open partner map"
        >
          <GlobalIcon />
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate(roleInboxPath(role))}
            className="flex items-center justify-center rounded-full p-1 transition-opacity hover:opacity-70"
            aria-label="Notifications"
          >
            <BellIcon />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-black not-italic">
              {unreadCount}
            </span>
          )}
        </div>
        <UserDropdown role={role} />
      </div>
    </header>
  );
}
