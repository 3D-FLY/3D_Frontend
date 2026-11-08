import { type CSSProperties } from "react";

/** Dashboard text field / select surface (same look as the Settings page, not the landing `Input`). */
export const DASHBOARD_INPUT_CLASS =
  "w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors";
export const DASHBOARD_LABEL_CLASS =
  "block text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-1.5";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Renders a `<select>` when set to "select" (then `options` is required). Default: text input. */
  as?: "input" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  /** Validation message; also turns the border red. */
  error?: string | undefined;
  /** Focus border color. Runtime value (a store/supplier accent), so it is applied inline. */
  accentColor?: string;
  className?: string;
}

/** Label + input/select in the dashboard style. */
export default function FormField({
  label,
  value,
  onChange,
  as = "input",
  options = [],
  placeholder,
  error,
  accentColor = "#5ac422",
  className = "",
}: FormFieldProps) {
  const controlClass = `${DASHBOARD_INPUT_CLASS} ${
    error ? "border-red-400/60" : "focus:border-[var(--field-accent)]"
  }`;
  const style = { "--field-accent": accentColor } as CSSProperties;

  return (
    <div className={className}>
      <label className={DASHBOARD_LABEL_CLASS}>{label}</label>
      {as === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={controlClass}
          style={style}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={controlClass}
          style={style}
        />
      )}
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
