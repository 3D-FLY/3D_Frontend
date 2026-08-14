interface ActiveBadgeProps {
  active: boolean;
  color: string;
  className?: string;
}

function hexAlpha(hex: string, opacity: number): string {
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, "0");
  return `${hex}${alpha}`;
}

export default function ActiveBadge({ active, color, className = "" }: ActiveBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        active ? "" : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40"
      } ${className}`}
      style={
        active
          ? {
              backgroundColor: hexAlpha(color, 0.15),
              color,
              border: `1px solid ${hexAlpha(color, 0.3)}`,
            }
          : {}
      }
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
