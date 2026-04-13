type AccentColor = "green" | "yellow";

interface StatusBadgeProps {
  count: string | number;
  label: string;
  accentColor?: AccentColor;
}

const accentClasses: Record<AccentColor, string> = {
  green: "text-green-400",
  yellow: "text-yellow-400",
};

export default function StatusBadge({
  count,
  label,
  accentColor = "green",
}: StatusBadgeProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-900 p-4 text-center">
      <span className={`text-3xl font-bold ${accentClasses[accentColor]}`}>
        {count}
      </span>
      <span className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
        {label}
      </span>
    </div>
  );
}
