import type { ReactNode } from "react";

interface WizardProgressBarProps {
  current: number;
  total: number;
  title: string;
  /** Extra action on the right (e.g. "Clear form") */
  action?: ReactNode;
  className?: string;
}

// Sticky progress for screens below lg, flush under the navbar (like ExploreProgressBar).
export default function WizardProgressBar({
  current,
  total,
  title,
  action,
  className = "",
}: WizardProgressBarProps) {
  return (
    <div
      className={`sticky top-[var(--nav-h)] z-30 -mx-6 border-b border-white/5 bg-dark/90 px-6 py-3 backdrop-blur ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60">
          <span className="text-green-500">
            Step {current + 1} of {total}
          </span>{" "}
          · {title}
        </p>
        {action}
      </div>
      <div
        className="mt-2 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
        aria-label="Application progress"
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-colors duration-300 ${
              i <= current ? "bg-green-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
