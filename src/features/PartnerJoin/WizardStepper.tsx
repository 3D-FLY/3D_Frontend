import { AlertTriangle, Check } from "lucide-react";
import type { WizardStep } from "./supplierSteps.js";

export type StepStatus = "done" | "current" | "error" | "upcoming";

interface WizardStepperProps {
  steps: readonly WizardStep[];
  current: number;
  statuses: readonly StepStatus[];
  /** Live summary per step (shown as one truncated line) */
  summaries: readonly string[][];
  canSelect: (index: number) => boolean;
  onSelect: (index: number) => void;
  className?: string;
}

const STATUS_TEXT: Record<StepStatus, string> = {
  done: "Completed",
  current: "In progress",
  error: "Needs attention",
  upcoming: "Not started",
};

// Horizontal stepper for lg+ screens: status per step, one-line live summaries,
// jump to reachable steps.
export default function WizardStepper({
  steps,
  current,
  statuses,
  summaries,
  canSelect,
  onSelect,
  className = "",
}: WizardStepperProps) {
  return (
    <nav aria-label="Application steps" className={className}>
      <ol
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => {
          const status = statuses[index] ?? "upcoming";
          const selectable = canSelect(index) && index !== current;
          const summary = (summaries[index] ?? []).join(" · ");
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="relative min-w-0">
              {/* connector to the next step */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[44px] right-[-4px] top-[19px] h-px ${
                    status === "done" ? "bg-green-500/50" : "bg-white/10"
                  }`}
                />
              )}
              <button
                type="button"
                disabled={!selectable}
                aria-current={index === current ? "step" : undefined}
                onClick={() => onSelect(index)}
                className="flex w-full min-w-0 flex-col items-start gap-2 rounded-xl p-1 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-green-500/60 enabled:cursor-pointer enabled:hover:bg-white/[0.03] disabled:cursor-default"
              >
                <span
                  aria-hidden="true"
                  className={[
                    "relative flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border text-[13px] font-bold transition-colors",
                    status === "done" && "border-green-500 bg-green-500 text-dark",
                    status === "current" && "border-green-500 bg-dark text-green-500 ring-4 ring-green-500/15",
                    status === "error" && "border-rose-400/70 bg-dark text-rose-400",
                    status === "upcoming" && "border-white/15 bg-dark text-white/40",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {status === "done" ? (
                    <Check size={15} strokeWidth={3} />
                  ) : status === "error" ? (
                    <AlertTriangle size={14} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="flex w-full min-w-0 flex-col gap-0.5 pr-2">
                  <span
                    className={`truncate text-[13px] font-bold uppercase tracking-wide ${
                      index === current ? "text-white" : "text-white/70"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.15em] ${
                      status === "error" ? "text-rose-400" : "text-green-500/80"
                    }`}
                  >
                    {STATUS_TEXT[status]}
                  </span>
                  {summary && index !== current && (
                    <span title={summary} className="truncate text-[12px] text-white/45">
                      {summary}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
