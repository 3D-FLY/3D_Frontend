type AccentColor = "green" | "yellow" | "orange" | "blue" | "red";

interface StatusBadgeProps {
  count: string | number;
  label: string;
  accentColor?: AccentColor;
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
  className = "",
}: StatusBadgeProps) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center ${className}`}
    >
      <div className="flex h-[80%] w-full items-center justify-center rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] px-3 py-4">
        <span
          className={`text-[clamp(20px,2.6vw,48px)] font-extrabold leading-none ${accentClasses[accentColor]}`}
        >
          {count}
        </span>
      </div>
      <span className="text-[clamp(11px,1vw,20px)] font-semibold uppercase tracking-[0.05em] text-zinc-100">
        {label}
      </span>
    </div>
  );
}
