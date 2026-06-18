import { useState, useEffect } from "react";

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
}: StatusBadgeProps) {
  const numericTarget = typeof count === "number" ? count : NaN;
  const animated = useCountUp(isNaN(numericTarget) ? 0 : numericTarget);
  const display = isNaN(numericTarget)
    ? count
    : animated.toLocaleString("en-US");

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center ${className}`}
    >
      <div className="@container flex h-[80%] w-full items-center justify-center rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] px-3 py-4">
        <span
          className={`mx-auto block max-w-[90%] min-w-0 text-center text-[clamp(16px,17cqw,48px)] font-extrabold leading-none ${color ? "" : accentClasses[accentColor]}`}
          style={color ? { color } : undefined}
        >
          {display}
        </span>
      </div>
      <span className="text-[clamp(11px,1vw,14px)] font-semibold uppercase tracking-[0.05em] text-zinc-100">
        {label}
      </span>
    </div>
  );
}
