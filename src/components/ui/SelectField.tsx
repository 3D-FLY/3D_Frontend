import { useId, useMemo, useState } from "react";
import Select, { type StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";
import FieldShell from "./FieldShell.js";

export interface SelectOption {
  value: string;
  label: string;
}

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
  /** Compact FieldShell layout (see FieldShell) */
  compact?: boolean;
  wrapperClassName?: string;
}

// Dark theme based on the admin SupplierMapPage select, matched to `Input`'s surface.
function buildStyles(hasError: boolean): StylesConfig<SelectOption, false> {
  return {
    control: (base, state) => ({
      ...base,
      background: "rgba(33,33,33,0.9)",
      borderRadius: 18,
      minHeight: 42,
      borderColor: hasError
        ? "#fb7185"
        : state.isFocused
          ? "rgba(149,149,149,0.5)"
          : "transparent",
      boxShadow: "none",
      "&:hover": { borderColor: hasError ? "#fb7185" : "rgba(149,149,149,0.5)" },
    }),
    valueContainer: (base) => ({ ...base, paddingLeft: 12 }),
    menu: (base) => ({
      ...base,
      background: "rgba(10,18,12,0.97)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 100,
    }),
    menuList: (base) => ({ ...base, maxHeight: 240 }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected
        ? "#5ac422"
        : state.isFocused
          ? "rgba(90,196,34,0.12)"
          : "transparent",
      color: state.isSelected ? "#000" : "#e8f5e8",
      cursor: "pointer",
      fontSize: 13,
    }),
    singleValue: (base) => ({ ...base, color: "#dfdfdf", fontWeight: 500 }),
    input: (base) => ({ ...base, color: "#dfdfdf" }),
    placeholder: (base) => ({
      ...base,
      color: "#959595",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontSize: 13,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "#959595" }),
    clearIndicator: (base) => ({ ...base, color: "#959595" }),
    noOptionsMessage: (base) => ({ ...base, color: "#6b7280", fontSize: 12 }),
    loadingMessage: (base) => ({ ...base, color: "#6b7280", fontSize: 12 }),
  };
}

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
  compact = false,
  wrapperClassName = "",
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [input, setInput] = useState("");
  const styles = useMemo(() => buildStyles(Boolean(error)), [error]);

  // Filter ourselves so huge lists only render a capped slice.
  const visible = useMemo(() => {
    const q = input.trim().toLowerCase();
    const matches = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
    return matches.slice(0, maxVisible);
  }, [options, input, maxVisible]);

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
        <CreatableSelect<SelectOption, false>
          {...common}
          formatCreateLabel={(text) => `Use "${text}"`}
          onChange={(next) => onChange(next)}
        />
      ) : (
        <Select<SelectOption, false>
          {...common}
          onChange={(next) => onChange(next)}
        />
      )}
    </FieldShell>
  );
}
