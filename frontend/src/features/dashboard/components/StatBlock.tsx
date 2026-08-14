type AccentColor = "green" | "yellow" | "white";

interface StatBlockProps {
  value: string | number;
  label: string;
  subLabel?: string;
  accentColor?: AccentColor;
}

const accentClasses: Record<AccentColor, string> = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  white: "text-white",
};

export default function StatBlock({
  value,
  label,
  subLabel,
  accentColor = "white",
}: StatBlockProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className={`text-4xl font-bold ${accentClasses[accentColor]}`}>
        {value}
      </span>
      <span className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
        {label}
      </span>
      {subLabel && (
        <span className="mt-0.5 text-xs text-zinc-500">{subLabel}</span>
      )}
    </div>
  );
}
