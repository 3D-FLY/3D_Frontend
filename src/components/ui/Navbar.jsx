import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import LogoIcon from "../../icons/LogoIcon";
import LogoText from "../../icons/LogoText";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "FAQ", to: "/faq" },
  { label: "Store", to: "/store" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
];

const MENU_ANIMATION_MS = 280;

export default function Navbar() {
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

  // אם עוברים לדסקטופ כשהתפריט פתוח — נסגור אותו
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* TOP BAR */}
      <nav className="relative flex items-center bg-dark px-5 py-2 italic text-gray">
        {/* LEFT: Logo (icon) + company name on desktop */}
        <div className="flex flex-shrink-0 items-center gap-4 lg:gap-3">
        <LogoIcon className="h-[80px] w-auto py-1" />
          {/* Desktop: show company name near logo */}
          <LogoText className="hidden lg:block h-9"/>
        </div>

        {/* CENTER: desktop nav */}
        <ul className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {navItems
            .filter((x) => x.to !== "/") // בדסקטופ לא חייבים HOME (אם כן—תורידי את השורה הזו)
            .map((item) => (
              <li key={item.to} className="whitespace-nowrap">
                <span className="transition-colors hover:text-white text-gray cursor-default">
                  {item.label}
                </span>
              </li>
            ))}
        </ul>

        {/* CENTER: mobile/tablet company name */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
          <LogoText className="h-5 sm:h-6" />
        </div>

        {/* RIGHT: desktop buttons */}
        <div className="ml-auto hidden flex-shrink-0 items-center gap-2 lg:flex">
          <Button
            hovering="darkBg"
            variant="secondary"
            className="h-[44px] w-[143px] text-base font-extrabold italic"
          >
            sign in
          </Button>
          <Button
            hovering="darkBg"
            variant="secondary"
            className="h-[44px] w-[143px] text-base font-extrabold italic"
          >
            join now
          </Button>
        </div>

        {/* RIGHT: mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-green transition hover:bg-white/10 lg:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      {showOverlay && (
        <div className="fixed inset-0 z-[60] lg:hidden" aria-hidden={!open}>
          {/* רקע מעומעם — fade in/out */}
          <div
            onClick={closeMenu}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-[280ms] ease-out ${
              closing ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* הפאנל — slide + fade */}
          <div className="absolute inset-0 flex items-stretch justify-center pointer-events-none">
            <div
              className={`pointer-events-auto relative h-full w-full bg-[#1f1f1f] px-6 pt-6 transition-[transform,opacity] duration-[280ms] ease-out ${
                closing
                  ? "translate-y-[-8%] opacity-0"
                  : mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[-8%] opacity-0"
              }`}
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="absolute right-4 top-4 rounded-md p-2 text-green transition hover:bg-white/10"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="mt-10 flex h-[calc(100%-40px)] flex-col items-center">
                <ul className="mt-6 flex w-full max-w-sm flex-col items-center gap-5">
                  {navItems.map((item) => (
                    <li key={item.to} className="w-full">
                      <span className="block w-full rounded-md px-6 py-3 text-center text-xl uppercase tracking-wide text-gray transition cursor-default">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pb-10 opacity-70">
                  <LogoIcon className="h-40 w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
