import { type CSSProperties, type ReactNode, useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNavbar from "./components/DashboardNavbar.js";
import Sidebar, { roleLabels } from "./components/Sidebar.js";
import type { SidebarRole } from "./components/Sidebar.js";
import MobileTopBar, { MOBILE_TOPBAR_H } from "./components/MobileTopBar.js";
import MobileBottomNav, { MOBILE_BOTTOM_NAV_H } from "./components/MobileBottomNav.js";
import { MOBILE_NAV } from "./mobileNav.js";
import Turtle from "../../components/ui/Turtle.jsx";
import FooterSlim from "../../components/layout/FooterSlim.js";

interface DashboardLayoutProps {
  role: SidebarRole;
  children?: ReactNode;
}

const NAVBAR_H        = 72;
const SIDEBAR_W       = 210;
const BANNER_H        = 44;
const BANNER_MT       = 50;
const BANNER_MB       = 40;
const BANNER_SLOT     = BANNER_MT + BANNER_H + BANNER_MB;
const MAIN_PL         = 50;
const BANNER_OVERFLOW = 100; // extends off-screen to the left

// Desktop offsets exposed as CSS variables so the mobile shell can switch them on at `md`.
const MOBILE_SHELL_MAIN_VARS = {
  "--d-top": `${NAVBAR_H}px`,
  "--d-left": `${SIDEBAR_W}px`,
  "--d-pt": `${BANNER_SLOT}px`,
  "--d-px": `${MAIN_PL}px`,
  "--m-top": `${MOBILE_TOPBAR_H}px`,
  "--m-bottom": `${MOBILE_BOTTOM_NAV_H}px`,
} as CSSProperties;

const MOBILE_SHELL_MAIN_CLASS = [
  "ml-0 mt-[var(--m-top)] px-4 pt-6 pb-[calc(var(--m-bottom)+env(safe-area-inset-bottom)+24px)] min-h-[calc(100dvh-var(--m-top))]",
  "md:ml-[var(--d-left)] md:mt-[var(--d-top)] md:px-[var(--d-px)] md:pt-[var(--d-pt)] md:pb-[150px] md:min-h-[calc(100dvh-var(--d-top))]",
].join(" ");

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const label    = roleLabels[role];
  // null = no mobile design for this role yet: keep the desktop layout at every width
  const mobileNav = MOBILE_NAV[role];
  const desktopOnly = mobileNav ? "hidden md:block" : "";
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleScroll = useCallback(() => {
    setCollapsed(window.scrollY > 0);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="bg-dark font-sans text-white">

      {/* NAVBAR — fixed, full width */}
      <div className={desktopOnly}>
        <DashboardNavbar role={role} />
      </div>

      {/* MOBILE SHELL — top bar + bottom nav below md, only for roles with a MOBILE_NAV config */}
      {mobileNav && (
        <>
          <MobileTopBar role={role} profileMenu={mobileNav.profileMenu} className="md:hidden" />
          <MobileBottomNav role={role} items={mobileNav.bottomBar} className="md:hidden" />
        </>
      )}

      {/* BANNER — fixed, expands/collapses on scroll */}
      <div className={desktopOnly}>
      <motion.div
        className="flex items-center bg-green overflow-hidden"
        initial={false}
        style={{
          position: "fixed",
          top: NAVBAR_H + BANNER_MT,
          left: -BANNER_OVERFLOW,
          height: BANNER_H,
          zIndex: 950,
          justifyContent: collapsed ? "center" : "flex-end",
        }}
        animate={{
          width: collapsed ? SIDEBAR_W + BANNER_OVERFLOW : SIDEBAR_W + MAIN_PL + BANNER_OVERFLOW + 220,
          clipPath: collapsed
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)",
          borderRadius: collapsed ? "0 8px 8px 0" : "0 4px 4px 0",
        }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="flex items-center font-sans text-3xl font-extrabold italic text-black"
          initial={false}
          animate={{
            paddingLeft: collapsed ? BANNER_OVERFLOW + 24 : BANNER_OVERFLOW + 8,
            paddingRight: collapsed ? 0 : 36,
          }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="whitespace-nowrap">{label}</span>
        </motion.div>
      </motion.div>
      </div>
      {/* SIDEBAR — fixed, always visible, z:100 */}
      <aside
        className={`${mobileNav ? "hidden md:flex" : "flex"} flex-col bg-dark`}
        style={{
          position: "fixed",
          top: NAVBAR_H,
          left: 0,
          width: SIDEBAR_W,
          height: `calc(100dvh - ${NAVBAR_H}px)`,
          zIndex: 100,
          overflowY: "hidden",
          flexShrink: 0,
        }}
      >
        <div style={{ paddingTop: BANNER_SLOT, flexShrink: 0 }} />
        <Sidebar role={role} />
      </aside>

      {/* MAIN — normal page flow, pushed right of sidebar and below navbar */}
      <main
        className={mobileNav ? MOBILE_SHELL_MAIN_CLASS : undefined}
        style={mobileNav ? { position: "relative", boxSizing: "border-box", ...MOBILE_SHELL_MAIN_VARS } : {
          position: "relative",
          marginTop: NAVBAR_H,
          marginLeft: SIDEBAR_W,
          paddingTop: BANNER_SLOT,
          /* Aligns with banner label start: -BANNER_OVERFLOW + textPaddingL (expanded) = SIDEBAR_W + MAIN_PL from viewport left; main starts at SIDEBAR_W so inner pad = MAIN_PL */
          paddingLeft: MAIN_PL,
          paddingRight: MAIN_PL,
          paddingBottom: 150,
          minHeight: `calc(100dvh - ${NAVBAR_H}px)`,
          boxSizing: "border-box",
        }}
      >
        {/* GLOW CIRCLES — absolute, scroll with content */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", 
            top: 0, 
            left: 0, 
            width: 500, 
            height: 500, 
            background: "radial-gradient(circle, #6B7280 0%, transparent 90%)", 
            filter: "blur(150px)", opacity: 0.4, transform: "translate(-20%, -5%)" }} />
          <div style={{ position: "absolute", top: "50%", right: 0, width: 300, height: 300, background: "radial-gradient(circle, #6B7280 0%, transparent 80%)", filter: "blur(110px)", opacity: 0.4, transform: "translate(40%, -50%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 300, height: 300, background: "radial-gradient(circle, #6B7280 0%, transparent 80%)", filter: "blur(140px)", opacity: 0.4, transform: "translate(-20%, 30%)" }} />
          <Turtle right="0" bottom="0" width="100vw" translateX="50%" translateY="25%" opacity={0.15} zIndex={0} />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1320,
            marginInline: "auto",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children ?? <Outlet />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER — full width, z:1100 → floats above sidebar+navbar when scrolled to */}
      <div className={desktopOnly} style={{ position: "relative", zIndex: 1100 }}>
        <FooterSlim />
      </div>

    </div>
  );
}