import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { SidebarRole } from "./Sidebar.js";

export interface UserMenuItem {
  label: string;
  to: string;
  icon: LucideIcon;
  danger?: boolean;
}

const DROPDOWN_USER: Record<SidebarRole, { name: string; email: string; initials: string; plan: string }> = {
  admin:    { name: "Raz Malka",   email: "raz@3dfly.io",    initials: "RM", plan: "Super Admin" },
  seller:   { name: "Raz Store",   email: "raz@3dfly.com",   initials: "RS", plan: "Pro Plan"    },
  supplier: { name: "David Print", email: "david@printlab.io", initials: "DP", plan: "Supplier"  },
};

interface UserMenuProps {
  role: SidebarRole;
  items: UserMenuItem[];
}

/** Profile avatar button + dropdown, shared by the desktop navbar and the mobile top bar. */
export default function UserMenu({ role, items }: UserMenuProps) {
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
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate(item.to);
                    }}
                    className={
                      item.danger
                        ? "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-400/5 hover:text-red-300"
                        : "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                    }
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
