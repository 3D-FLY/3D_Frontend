import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Turtle from "../ui/Turtle";
import UserIcon from "./icons/UserIcon";
import IconNavMenu from "./icons/IconNavMenu";
import IconClose from "./icons/IconClose";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "FAQ", to: "/faq" },
  { label: "Store", to: "/store" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
];

const mobileMenuItems = [
  { label: "Home", to: "/" },
  { label: "Log In", to: "/login" },
  { label: "Sign Up", to: "/register" },
  { label: "Explore", to: "/explore" },
  { label: "FAQ", to: "/faq" },
  { label: "Store", to: "/store" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
];

const MENU_ANIMATION_MS = 280;

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const showOverlay = open || closing;

  // נועל גלילה כשהתפריט פתוח
  useEffect(() => {
    document.body.style.overflow = showOverlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showOverlay]);

  // אנימציית כניסה: אחרי שהתפריט נטען מעבירים ל־mounted
  useEffect(() => {
    if (open && !closing) {
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMounted(true));
      });
      return () => cancelAnimationFrame(t);
    }
    if (!open) setMounted(false);
  }, [open, closing]);

  const closeMenu = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, MENU_ANIMATION_MS);
  };

  // אם עוברים לדסקטופ (xl) כשהתפריט פתוח — נסגור אותו
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) closeMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* TOP BAR */}
      <nav className="relative flex items-center bg-dark px-5 py-2 italic text-gray">
        {/* ===== דסקטופ (xl): לוגו + שם חברה | ניווט | כפתורים ===== */}
        <Link to="/" className="hidden flex-shrink-0 items-center gap-3 xl:flex">
          <Turtle icon className="h-[70px] w-auto py-1" />
          {/* Figma 106-876: Montserrat ExtraBold Italic, 36 px, #959595 */}
          <span className="font-sans font-extrabold italic text-gray text-4xl leading-none whitespace-nowrap select-none">
            3D-Fly
          </span>
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-6 xl:flex">
          {navItems
            .filter((x) => x.to !== "/")
            .map((item) => (
              <li key={item.to} className="whitespace-nowrap">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "transition-colors hover:text-white",
                      isActive ? "text-white" : "",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
        </ul>

        <div className="hidden flex-shrink-0 items-center gap-2 xl:flex">
          <Button
            type="button"
            hovering="darkBg"
            variant="secondary"
            className="h-[44px] w-[143px] text-base font-extrabold italic"
            onClick={() => navigate("/login")}
          >
            sign in
          </Button>
          <Button
            type="button"
            hovering="darkBg"
            variant="secondary"
            className="h-[44px] w-[143px] text-base font-extrabold italic"
            onClick={() => navigate("/register")}
          >
            join now
          </Button>
        </div>

        {/* ===== מובייל + טאבלט (< xl): לוגו | שם חברה | user + המבורגר ===== */}
        <Link to="/" className="flex flex-shrink-0 items-center xl:hidden">
          <Turtle icon className="h-[50px] w-auto" />
        </Link>

        {/* Figma 1010-628: 3D-Fly centred, Montserrat ExtraBold Italic 32 px, #959595 */}
        <div className="flex flex-1 justify-center xl:hidden">
          <span className="font-sans font-extrabold italic text-gray text-[32px] leading-none whitespace-nowrap select-none">
            3D-Fly
          </span>
        </div>

        {/* Right group: user icon + hamburger (Figma: user 27 px, gap ~8 px, hamburger 32 px) */}
        <div className="flex flex-shrink-0 items-center gap-1 xl:hidden">
          <UserIcon className="h-[27px] w-[27px]" />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-1 text-green transition"
          >
            <IconNavMenu className="h-[32px] w-[32px]" />
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      {showOverlay && (
        <div className="fixed inset-0 z-[60] xl:hidden" aria-hidden={!open}>
          {/* פאנל מלא — slide + fade */}
          <div
            className={`absolute inset-0 flex flex-col bg-[#1f1f1f] transition-[transform,opacity] duration-[280ms] ease-out ${
              closing
                ? "translate-y-[-8%] opacity-0"
                : mounted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-8%] opacity-0"
            }`}
          >
            {/* כפתור סגירה — פינה ימנית עליונה */}
            <div className="flex justify-end px-4 pt-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="p-1 text-green transition hover:opacity-70"
              >
                <IconClose className="h-7 w-7" />
              </button>
            </div>

            {/* פריטי ניווט */}
            <nav className="flex-1">
              <ul className="flex flex-col">
                {mobileMenuItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        [
                          "block w-full py-[22px] text-center text-[30px] font-medium italic uppercase tracking-wide transition-colors text-white",
                          isActive ? "bg-[#333333]" : "hover:bg-[#2a2a2a]",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Turtle — תחתית, ממורכז */}
            <div className="flex justify-center pb-10">
              <div className="relative flex items-center justify-center opacity-70 w-[50vw] md:w-[30vw]">
                {/* Ellipse 4 — glow behind the logo */}
                <div className="absolute w-[120%] aspect-square rounded-[50%] bg-[#858585] opacity-40 blur-3xl" />
                <Turtle icon className="relative z-10 w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
