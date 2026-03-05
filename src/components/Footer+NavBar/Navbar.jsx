import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button";
import Turtle from "../ui/Turtle";
import LogoText from "../../icons/LogoText";
import IconNavMenu from "../../icons/IconNavMenu";
import IconClose from "../../icons/IconClose";

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
          <LogoText className="h-9" />
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

        {/* ===== מובייל + טאבלט (< xl): לוגו | שם חברה | כפתור פופאפ ===== */}
        <Link to="/" className="flex flex-shrink-0 items-center xl:hidden">
          <Turtle icon className="h-[50px] w-auto py-1" />
        </Link>

        <div className="flex flex-1 justify-center xl:hidden">
          <LogoText className="h-4 sm:h-5" />
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="inline-flex flex-shrink-0 items-center justify-center rounded-md p-2 text-green transition hover:bg-white/10 xl:hidden"
        >
          <IconNavMenu className="h-7 w-7" />
        </button>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      {showOverlay && (
        <div className="fixed inset-0 z-[60] xl:hidden" aria-hidden={!open}>
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
                <IconClose className="h-[22px] w-[22px]" />
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
                  <Turtle icon className="h-40 w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
