import { type ReactNode, useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar.js";
import Sidebar from "./components/Sidebar.js";
import type { SidebarRole } from "./components/Sidebar.js";
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
const SKEW_DEG        = 20;
const BANNER_OVERFLOW = 100; // extends off-screen to the left
const BANNER_PAD_R    = 48;  // right padding after text
const BANNER_MIN_W_COLLAPSED = 320;
const BANNER_TRANSITION = "width 0.55s cubic-bezier(0.4,0,0.2,1), padding-left 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1), border-radius 0.55s cubic-bezier(0.4,0,0.2,1)";

const roleLabels: Record<SidebarRole, string> = {
  admin: "ADMIN",
  seller: "MY STORE",
};

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const label = roleLabels[role];
  const [collapsed, setCollapsed] = useState(false);

  const handleScroll = useCallback(() => {
    setCollapsed(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const textPaddingL = collapsed ? BANNER_OVERFLOW + 20 : SIDEBAR_W + MAIN_PL + BANNER_OVERFLOW;
  const skewNow      = SKEW_DEG;
  const radiusNow    = 5;

  return (
    <div className="bg-dark font-sans text-white">

      {/* NAVBAR — fixed, full width */}
      <DashboardNavbar />

      {/* BANNER — parallelogram, left side hidden off-screen */}
      <div
        className="flex items-center bg-green"
        style={{
          position: "fixed",
          top: NAVBAR_H + BANNER_MT,
          left: -BANNER_OVERFLOW,
          width: "fit-content",
          minWidth: collapsed ? BANNER_MIN_W_COLLAPSED : undefined,
          height: BANNER_H,
          zIndex: 950,
          borderRadius: radiusNow,
          transform: `skewX(-${skewNow}deg)`,
          transformOrigin: "left top",
          transition: BANNER_TRANSITION,
        }}
      >
        <span
          className="font-sans text-3xl font-extrabold italic text-black"
          style={{
            paddingLeft: textPaddingL,
            paddingRight: BANNER_PAD_R,
            whiteSpace: "nowrap",
            display: "inline-block",
            transform: `skewX(${skewNow}deg)`,
            transition: BANNER_TRANSITION,
          }}
        >
          {label}
        </span>
      </div>

      {/* SIDEBAR — fixed, always visible, z:100 */}
      <aside
        className="flex flex-col bg-dark"
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
        style={{
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
          {children ?? <Outlet />}
        </div>
      </main>

      {/* FOOTER — full width, z:1100 → floats above sidebar+navbar when scrolled to */}
      <div style={{ position: "relative", zIndex: 1100 }}>
        <FooterSlim />
      </div>

    </div>
  );
}