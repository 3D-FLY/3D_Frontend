import { useId, useMemo, useState } from "react";
import Select, { type GroupBase, type StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";
import { Check } from "lucide-react";
import FieldShell from "./FieldShell.js";

export interface SelectOption {
  value: string;
  label: string;
}

type OptionList = readonly (SelectOption | GroupBase<SelectOption>)[];

interface SelectFieldProps {
  label?: string;
  options: readonly SelectOption[];
  value: SelectOption | null;
  onChange: (next: SelectOption | null) => void;
  placeholder?: string;
  error?: string | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
  /** Lets the user type a value that is not in the list */
  creatable?: boolean;
  /** Caps rendered options (large lists such as cities) */
  maxVisible?: number;
  /** Ranked filtering; defaults to a case-insensitive "contains" */
  search?: (options: readonly SelectOption[], query: string) => SelectOption[];
  /** Shown in a "Suggested" group above the list while nothing is typed */
  suggested?: SelectOption | undefined;
  /** Heading of the full list when `suggested` is shown */
  allHeading?: string;
  /** Compact FieldShell layout (see FieldShell) and a bordered control */
  compact?: boolean;
  wrapperClassName?: string;
}

// Dark theme based on the admin SupplierMapPage select, matched to `Input`'s surface.
// The menu matches the mobile bottom sheet: selected option in green with a check.
function buildStyles(
  hasError: boolean,
  compact: boolean,
): StylesConfig<SelectOption, false, GroupBase<SelectOption>> {
  const idleBorder = compact ? "rgba(255,255,255,0.1)" : "transparent";
  const focusBorder = compact ? "rgba(90,196,34,0.6)" : "rgba(149,149,149,0.5)";
  return {
    control: (base, state) => ({
      ...base,
      background: "rgba(33,33,33,0.9)",
      borderRadius: 18,
      minHeight: 44,
      borderColor: hasError ? "#fb7185" : state.isFocused ? focusBorder : idleBorder,
      boxShadow: "none",
      "&:hover": { borderColor: hasError ? "#fb7185" : focusBorder },
    }),
    valueContainer: (base) => ({ ...base, paddingLeft: 14 }),
    menu: (base) => ({
      ...base,
      background: "#222222",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      overflow: "hidden",
      zIndex: 100,
    }),
    menuList: (base) => ({ ...base, maxHeight: 280, padding: 6 }),
    group: (base) => ({ ...base, paddingTop: 2, paddingBottom: 2 }),
    groupHeading: (base) => ({
      ...base,
      color: "rgba(255,255,255,0.4)",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.15em",
      marginBottom: 2,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 10,
      background: state.isSelected
        ? state.isFocused
          ? "rgba(90,196,34,0.15)"
          : "rgba(90,196,34,0.10)"
        : state.isFocused
          ? "rgba(255,255,255,0.07)"
          : "transparent",
      color: state.isSelected ? "#5ac422" : "rgba(255,255,255,0.85)",
      fontWeight: state.isSelected ? 600 : 400,
      cursor: "pointer",
      fontSize: 14,
      "&:active": { background: "rgba(90,196,34,0.15)" },
    }),
    singleValue: (base) => ({ ...base, color: "#dfdfdf", fontWeight: 500 }),
    input: (base) => ({ ...base, color: "#dfdfdf" }),
    placeholder: (base) => ({ ...base, color: "rgba(149,149,149,0.7)" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "rgba(255,255,255,0.4)" }),
    clearIndicator: (base) => ({ ...base, color: "rgba(255,255,255,0.4)" }),
    noOptionsMessage: (base) => ({ ...base, color: "#6b7280", fontSize: 13 }),
    loadingMessage: (base) => ({ ...base, color: "#6b7280", fontSize: 13 }),
  };
}

const defaultSearch = (options: readonly SelectOption[], query: string) => {
  const q = query.trim().toLowerCase();
  return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : [...options];
};

export default function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
  error,
  isLoading = false,
  isDisabled = false,
  creatable = false,
  maxVisible = Infinity,
  search = defaultSearch,
  suggested,
  allHeading = "All",
  compact = false,
  wrapperClassName = "",
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [input, setInput] = useState("");
  const styles = useMemo(() => buildStyles(Boolean(error), compact), [error, compact]);

  // Filter ourselves (ranked search, capped slice for huge lists).
  const visible: OptionList = useMemo(() => {
    const matches = search(options, input).slice(0, maxVisible);
    if (suggested && !input.trim()) {
      return [
        { label: "Suggested", options: [suggested] },
        { label: allHeading, options: matches },
      ];
    }
    return matches;
  }, [options, input, maxVisible, search, suggested, allHeading]);

  const common = {
    inputId: id,
    options: visible,
    value,
    placeholder,
    isLoading,
    isDisabled,
    styles,
    filterOption: null,
    onInputChange: (next: string) => setInput(next),
    formatOptionLabel: (
      option: SelectOption,
      meta: { context: "menu" | "value"; selectValue: readonly SelectOption[] },
    ) =>
      meta.context === "menu" && meta.selectValue.some((v) => v.value === option.value) ? (
        <span className="flex items-center justify-between gap-3">
          {option.label}
          <Check size={16} strokeWidth={2.5} aria-hidden="true" />
        </span>
      ) : (
        option.label
      ),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  return (
    <FieldShell
      label={label}
      htmlFor={id}
      error={error}
      errorId={errorId}
      compact={compact}
      className={wrapperClassName}
    >
      {creatable ? (
        <CreatableSelect<SelectOption, false, GroupBase<SelectOption>>
          {...common}
          formatCreateLabel={(text) => `Use "${text}"`}
          onChange={(next) => onChange(next)}
        />
      ) : (
        <Select<SelectOption, false, GroupBase<SelectOption>>
          {...common}
          onChange={(next) => onChange(next)}
        />
      )}
    </FieldShell>
  );
}
