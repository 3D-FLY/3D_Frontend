import { ChevronDown } from "lucide-react";

interface ChoiceTriggerProps {
  id: string;
  /** id of the field label; the button is named "<label> <value>" */
  labelId: string;
  valueId: string;
  errorId: string;
  /** Current answer, or undefined to show the placeholder */
  displayValue?: string | undefined;
  placeholder: string;
  open: boolean;
  error?: string | undefined;
  /** Bordered surface for forms on the bare page background */
  compact?: boolean;
  onOpen: () => void;
}

// The closed state of a choice field: looks like a text field, shows the current
// answer (or a placeholder) and a chevron, and opens a picker.
export default function ChoiceTrigger({
  id,
  labelId,
  valueId,
  errorId,
  displayValue,
  placeholder,
  open,
  error,
  compact = false,
  onOpen,
}: ChoiceTriggerProps) {
  return (
    <button
      id={id}
      type="button"
      data-choice-trigger
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-labelledby={`${labelId} ${valueId}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      onClick={onOpen}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-[18px] border bg-[rgba(33,33,33,0.9)] px-4 py-2.5 text-left text-base font-medium outline-none transition-[border-color] duration-200",
        error
          ? "border-rose-400 focus-visible:border-rose-400/60"
          : compact
            ? "border-white/10 focus-visible:border-green-500/60"
            : "border-transparent focus-visible:border-gray/50",
      ].join(" ")}
    >
      <span id={valueId} className={displayValue ? "text-[#dfdfdf]" : "text-gray/70"}>
        {displayValue ?? placeholder}
      </span>
      <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-white/40" />
    </button>
  );
}
