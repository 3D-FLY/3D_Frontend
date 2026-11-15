import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import BottomSheet from "./BottomSheet.js";
import ChoiceGroup, { type ChoiceOption } from "./ChoiceGroup.js";
import ChoiceTrigger from "./ChoiceTrigger.js";
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
          <ChoiceTrigger
            id={triggerId}
            labelId={labelId}
            valueId={valueId}
            errorId={errorId}
            displayValue={selected?.label}
            placeholder={placeholder}
            open={open}
            error={error}
            compact={compact}
            onOpen={() => setOpen(true)}
          />
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
