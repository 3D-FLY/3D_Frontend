import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import BottomSheet from "./BottomSheet.js";
import ChoiceGroup, { type ChoiceOption } from "./ChoiceGroup.js";
import FieldShell from "./FieldShell.js";

interface SingleChoiceFieldProps {
  label: string;
  options: readonly ChoiceOption[];
  value: string;
  onChange: (next: string) => void;
  error?: string | undefined;
  placeholder?: string;
  /** Compact FieldShell layout and a bordered trigger (for forms on the bare background) */
  compact?: boolean;
  className?: string;
}

// One question, one control:
// - below lg: a field showing the current answer; tapping opens a bottom sheet.
// - lg+: the options as radio chips (no extra click).
export default function SingleChoiceField({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select…",
  compact = false,
  className = "",
}: SingleChoiceFieldProps) {
  const id = useId();
  const triggerId = `${id}-trigger`;
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const errorId = `${id}-error`;
  const [open, setOpen] = useState(false);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const selected = options.find((o) => o.value === value);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  // Listbox keyboard: arrows/Home/End move, Enter/Space choose.
  const onOptionKeyDown = (e: KeyboardEvent<HTMLLIElement>, index: number) => {
    const last = options.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const option = options[index];
      if (option) choose(option.value);
      return;
    }
    if (next === null) return;
    e.preventDefault();
    optionRefs.current[next]?.focus();
  };

  return (
    <div className={className}>
      {/* Mobile / tablet: field + bottom sheet */}
      <div className="lg:hidden">
        <FieldShell
          compact={compact}
          label={label}
          labelId={labelId}
          htmlFor={triggerId}
          error={error}
          errorId={errorId}
        >
          <button
            id={triggerId}
            type="button"
            data-choice-trigger
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-labelledby={`${labelId} ${valueId}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onClick={() => setOpen(true)}
            className={[
              "flex w-full items-center justify-between gap-3 rounded-[18px] border bg-[rgba(33,33,33,0.9)] px-4 py-2.5 text-left text-base font-medium outline-none transition-[border-color] duration-200",
              error
                ? "border-rose-400 focus-visible:border-rose-400/60"
                : compact
                  ? "border-white/10 focus-visible:border-green-500/60"
                  : "border-transparent focus-visible:border-gray/50",
            ].join(" ")}
          >
            <span id={valueId} className={selected ? "text-[#dfdfdf]" : "text-gray/70"}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-white/40" />
          </button>
        </FieldShell>

        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title={label}
          getInitialFocus={() => optionRefs.current[selectedIndex]}
        >
          <ul role="listbox" aria-label={label} className="flex flex-col px-3">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={index === selectedIndex ? 0 : -1}
                  onClick={() => choose(option.value)}
                  onKeyDown={(e) => onOptionKeyDown(e, index)}
                  className={[
                    "flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-3 text-[15px] outline-none transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500/60",
                    isSelected
                      ? "bg-green-500/10 font-semibold text-green-500"
                      : "text-white/85 hover:bg-white/[0.04] active:bg-white/[0.06]",
                  ].join(" ")}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check size={18} strokeWidth={2.5} aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
        </BottomSheet>
      </div>

      {/* Desktop: visible radio chips */}
      <div className="hidden lg:block">
        <ChoiceGroup
          type="radio"
          compact={compact}
          roving
          label={label}
          options={options}
          value={value}
          onChange={onChange}
          error={error}
        />
      </div>
    </div>
  );
}
