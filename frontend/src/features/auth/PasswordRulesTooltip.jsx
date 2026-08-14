import React, { useLayoutEffect, useRef, useState } from "react";
import IconTooltipBubble from "../../components/ui/IconTooltipBubble.jsx";
import Turtle from "../../components/ui/Turtle.jsx";

/**
 * Floating tooltip that shows password requirements.
 * Triggered by hovering the IconPasswordInfo button inside the password field.
 *
 * Props:
 *  - password  string  — current password; each rule uses test() for live validation
 *  - visible   boolean — controlled by parent hover state
 */

const RULES = [
  {
    id: "length",
    label: "8+ characters",
    test: (pw) => pw.length >= 8,
  },
  {
    id: "upper",
    label: "Uppercase",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: "lower",
    label: "Lowercase",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    id: "number",
    label: "Number",
    test: (pw) => /\d/.test(pw),
  },
  {
    id: "special",
    label: "Special character",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

const VIEWPORT_PAD = 12;

export default function PasswordRulesTooltip({ password = "", visible }) {
  const rootRef = useRef(null);
  const [flipLeft, setFlipLeft] = useState(false);

  useLayoutEffect(() => {
    if (!visible) {
      setFlipLeft(false);
      return;
    }

    const measureFromScratch = () => {
      setFlipLeft(false);
      requestAnimationFrame(() => {
        const node = rootRef.current;
        if (!node) return;
        const r = node.getBoundingClientRect();
        const vw = window.visualViewport?.width ?? window.innerWidth;
        if (r.right > vw - VIEWPORT_PAD) setFlipLeft(true);
      });
    };

    measureFromScratch();
    window.addEventListener("resize", measureFromScratch);
    window.visualViewport?.addEventListener("resize", measureFromScratch);
    return () => {
      window.removeEventListener("resize", measureFromScratch);
      window.visualViewport?.removeEventListener("resize", measureFromScratch);
    };
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) return;
    requestAnimationFrame(() => {
      const node = rootRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const vw = window.visualViewport?.width ?? window.innerWidth;
      setFlipLeft((prev) => {
        if (r.right > vw - VIEWPORT_PAD) return true;
        if (!prev) return false;
        return prev;
      });
    });
  }, [visible, password]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      role="tooltip"
      className={[
        "absolute z-[100] bottom-[calc(100%+2px)]",
        "w-52 max-sm:w-[min(11rem,calc(100vw-2rem))]",
        flipLeft
          ? "right-0 left-auto translate-x-[-10px] max-sm:translate-x-[-6px]"
          : "left-[65%] right-auto",
      ].join(" ")}
    >
      {/* Turtle — decorative, behind the bubble */}
      <Turtle
        icon
        className="absolute left-1/2 w-[65%] h-auto z-0 opacity-60"
        style={{ top: 0, transform: "translateX(-50%) translateY(-63%)" }}
      />

      <IconTooltipBubble
        className={[
          "absolute inset-0 h-full w-full z-10",
          flipLeft ? "scale-x-[-1]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      <div className="relative z-10 px-4 pt-3 pb-10 max-sm:px-2.5 max-sm:pt-2 max-sm:pb-8">
        <p className="mb-1 text-xs font-medium uppercase italic text-black max-sm:mb-0.5 max-sm:text-[10px]">
          Password must contain:
        </p>

        <ul className="flex flex-col pl-2 max-sm:pl-1.5">
          {RULES.map(({ id, label, test }) => {
            const passed = test(password);
            return (
              <li
                key={id}
                className="flex items-center gap-2 max-sm:gap-1.5"
                data-rule-passed={passed}
              >
                <span className="flex-shrink-0 text-xs font-medium italic leading-none text-black max-sm:text-[10px]">
                  ●
                </span>
                <span className="text-xs font-medium uppercase italic leading-snug text-black max-sm:text-[10px]">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
