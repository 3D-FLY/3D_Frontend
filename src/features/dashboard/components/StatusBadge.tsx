import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EASE_SOFT, staggerDelay } from "../motion.js";

type AccentColor = "green" | "yellow" | "orange" | "blue" | "red";

function useCountUp(target: number, duration = 800): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

interface StatusBadgeProps {
  count: string | number;
  label: string;
  accentColor?: AccentColor;
  color?: string;
  className?: string;
  onClick?: () => void;
  /** Position in the tile row, used to stagger the entrance animation. */
  index?: number;
}

/** Mobile number size by text length, so long values (e.g. "$12,345") still fit. Desktop keeps its own size. */
function mobileNumberClass(text: string): string {
  if (text.length <= 4) return "max-md:text-[clamp(28px,36cqw,48px)]";
  if (text.length <= 6) return "max-md:text-[clamp(24px,26cqw,40px)]";
  return "max-md:text-[clamp(20px,20cqw,32px)]";
}

const accentClasses: Record<AccentColor, string> = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
  blue: "text-sky-400",
  red: "text-red-400",
};

export default function StatusBadge({
  count,
  label,
  accentColor = "green",
  color,
  className = "",
  onClick,
  index = 0,
}: StatusBadgeProps) {
  const numericTarget = typeof count === "number" ? count : NaN;
  const animated = useCountUp(isNaN(numericTarget) ? 0 : numericTarget);
  const display = isNaN(numericTarget)
    ? count
    : animated.toLocaleString("en-US");

  const Tag = onClick ? motion.button : motion.div;

  return (
    <Tag
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE_SOFT, delay: staggerDelay(index, 0.07) }}
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={`flex h-full w-full flex-col items-center justify-center gap-2 py-2 text-center ${
        onClick
          ? "cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit transition-opacity hover:opacity-80"
          : ""
      } ${className}`}
    >
      <div className="@container flex h-[80%] w-full items-center justify-center rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] px-3 py-4">
        <span
          className={`mx-auto block max-w-[90%] min-w-0 text-center text-[clamp(16px,17cqw,48px)] ${mobileNumberClass(String(display))} font-extrabold leading-none ${color ? "" : accentClasses[accentColor]}`}
          style={color ? { color } : undefined}
        >
          {display}
        </span>
      </div>
      <span className="text-[clamp(11px,1vw,14px)] font-semibold uppercase tracking-[0.05em] text-zinc-100">
        {label}
      </span>
    </Tag>
  );
}
