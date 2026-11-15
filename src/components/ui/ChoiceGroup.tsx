import { useId, useRef, useState, type KeyboardEvent } from "react";
import FieldShell from "./FieldShell.js";

export interface ChoiceOption {
  value: string;
  label: string;
}

interface ChoiceGroupBase {
  label?: string;
  /** Accessible name when there is no visible label */
  ariaLabel?: string;
  options: readonly ChoiceOption[];
  error?: string | undefined;
  /** Compact FieldShell layout (see FieldShell) */
  compact?: boolean;
  /**
   * Keyboard mode for long forms: the group is one Tab stop, arrow keys move
   * between chips (checkboxes) and Enter toggles the focused chip.
   * Radios already move with arrows natively; roving only adds Enter there.
   */
  roving?: boolean;
  className?: string;
}

interface RadioGroupProps extends ChoiceGroupBase {
  type: "radio";
  value: string;
  onChange: (next: string) => void;
}

interface CheckboxGroupProps extends ChoiceGroupBase {
  type: "checkbox";
  value: readonly string[];
  onChange: (next: string[]) => void;
}

export type ChoiceGroupProps = RadioGroupProps | CheckboxGroupProps;

// Chip styles copied from the dashboard (SupplierCapabilities.tsx) on md+.
// Below md: tighter padding and larger sentence-case text, so more chips fit per row.
const CHIP_BASE =
  "flex min-h-9 cursor-pointer select-none items-center rounded-md border px-3 py-1 text-[14px] font-semibold leading-tight transition-colors " +
  "md:min-h-10 md:px-4 md:py-1.5 md:text-[12px] md:font-bold md:uppercase md:tracking-wide " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-green-500/60 ";
const CHIP_OFF =
  "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60";
const CHIP_ON = "border-green-500/40 bg-green-500/15 text-green-500";

// Native radio/checkbox inputs (keyboard + screen reader friendly) styled as chips.
export default function ChoiceGroup(props: ChoiceGroupProps) {
  const {
    label,
    ariaLabel,
    options,
    error,
    compact = false,
    roving = false,
    className = "",
  } = props;
  const id = useId();
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const isChecked = (value: string) =>
    props.type === "radio" ? props.value === value : props.value.includes(value);

  const toggle = (value: string) => {
    if (props.type === "radio") {
      props.onChange(value);
    } else {
      props.onChange(
        props.value.includes(value)
          ? props.value.filter((v) => v !== value)
          : [...props.value, value],
      );
    }
  };

  // Roving tab stop for checkbox groups: the focused chip, else the first checked, else the first.
  const firstChecked = options.findIndex((o) => isChecked(o.value));
  const tabStop = focusIndex ?? (firstChecked >= 0 ? firstChecked : 0);
  const useRoving = roving && props.type === "checkbox";

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (!roving) return;
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const option = options[index];
      if (option) toggle(option.value);
      return;
    }
    if (!useRoving) return;
    const last = options.length - 1;
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    setFocusIndex(next);
    inputsRef.current[next]?.focus();
  };

  return (
    <FieldShell
      label={label}
      labelId={labelId}
      error={error}
      errorId={errorId}
      compact={compact}
      className={className}
    >
      <div
        role={props.type === "radio" ? "radiogroup" : "group"}
        aria-labelledby={label ? labelId : undefined}
        aria-label={!label ? ariaLabel : undefined}
        aria-describedby={error ? errorId : undefined}
        className="flex flex-wrap gap-1.5 md:gap-2"
      >
        {options.map((option, index) => {
          const checked = isChecked(option.value);
          return (
            <label key={option.value} className="relative">
              <input
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type={props.type}
                name={id}
                checked={checked}
                onChange={() => toggle(option.value)}
                onKeyDown={(e) => onKeyDown(e, index)}
                onFocus={() => setFocusIndex(index)}
                tabIndex={useRoving ? (index === tabStop ? 0 : -1) : undefined}
                className="peer sr-only"
              />
              <span className={`${CHIP_BASE}${checked ? CHIP_ON : CHIP_OFF}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}
