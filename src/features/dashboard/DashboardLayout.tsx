import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar/DashboardNavbar.js";
import Sidebar from "./components/Sidebar.js";
import type { SidebarRole } from "./components/Sidebar.js";
import Turtle from "../../components/ui/Turtle.jsx";
import Footer from "../../components/layout/Footer.js";

interface DashboardLayoutProps {
  role: SidebarRole;
  children?: ReactNode;
}

const NAVBAR_H      = 72;  // px — matches DashboardNavbar h-[72px]
const SIDEBAR_W     = 192; // px — matches Sidebar w-48
const BANNER_H      = 44;  // px
const BANNER_MT     = 30;  // px — gap above banner (below navbar)
const BANNER_MB     = 20;  // px — gap below banner (above content)
const BANNER_CLEAR  = BANNER_MT + BANNER_H + BANNER_MB; // total space to clear
const MAIN_PADDING  = 24;  // px — horizontal padding inside main (px-6)

const roleLabels: Record<SidebarRole, string> = {
  admin: "ADMIN",
  seller: "MY STORE",
};

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const label = roleLabels[role];

  return (
    // @ts-expect-error CSS custom property
    <div className="min-h-screen bg-dark font-sans text-white" style={{ position: "relative", "--cpl": "clamp(16px, 3vw, 48px)" }}>

      {/* NAVBAR — fixed, full width, z:1000 */}
      <DashboardNavbar />

      {/* SIDEBAR — fixed, below navbar, z:100; nav padding-top = banner height only */}
      <Sidebar role={role} bannerHeight={BANNER_H} />

      {/* BANNER — absolute at top of sidebar area (top: NAVBAR_H = right below navbar);
          z:950 sits above sidebar (z:100) and below navbar (z:1000) */}
      <div
        className="flex items-center bg-green"
        style={{
          position: "absolute",
          top: NAVBAR_H,   // aligns with the top of the sidebar (no extra margin)
          left: 0,
          width: "fit-content",
          height: BANNER_H,
          paddingRight: 40,
          zIndex: 950,
          borderRadius: "0 5px 5px 0",
          transform: "skewX(-18deg)",
          transformOrigin: "left center",
        }}
      >
        <span
          className="font-sans text-3xl font-extrabold italic text-black"
          style={{
            paddingLeft: `calc(${SIDEBAR_W}px + var(--cpl))`,
            display: "inline-block",
            transform: "skewX(18deg)",
          }}
        >
          {label}
        </span>
      </div>

      {/* LAYOUT ROOT — overflow:hidden keeps blur circles from causing scrollbars */}
      <div
        style={{
          marginTop: NAVBAR_H,
          marginLeft: SIDEBAR_W,
          minHeight: `calc(100vh - ${NAVBAR_H}px)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* DECORATIVE BACKGROUND — single absolutely-pinned layer, z:0, never affects flow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Circle 1 — Top Left */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, #6B7280 0%, transparent 70%)",
              filter: "blur(80px)",
              opacity: 0.4,
              transform: "translate(-30%, -30%)",
            }}
          />

          {/* Circle 2 — Bottom Left */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, #6B7280 0%, transparent 70%)",
              filter: "blur(80px)",
              opacity: 0.4,
              transform: "translate(-30%, 30%)",
            }}
          />

          {/* Circle 3 — Middle Right */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, #6B7280 0%, transparent 70%)",
              filter: "blur(80px)",
              opacity: 0.4,
              transform: "translate(40%, -50%)",
            }}
          />

          {/* Turtle logo — Bottom Right, decorative watermark */}
          <Turtle
            right="0"
            bottom="0"
            height="80vh"
            translateX="30%"
            translateY="0%"
            opacity={0.15}
            zIndex={0}
          />
        </div>

        {/* MAIN CONTENT — z:1 ensures it always renders above the decorative layer */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: BANNER_H + BANNER_MB,
            paddingLeft: "var(--cpl)",
            paddingRight: "var(--cpl)",
            paddingBottom: "clamp(120px, 20vh, 280px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            boxSizing: "border-box",
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {children ?? <Outlet />}
        </main>
      </div>

      {/* FOOTER — full width, z:950 so it visually covers the fixed sidebar */}
      <div style={{ position: "relative", zIndex: 950, width: "100%" }}>
        <Footer />
      </div>

    </div>
  );
}
