import { useId, type HTMLAttributes, type InputHTMLAttributes } from "react";
import FieldShell from "../../components/ui/FieldShell.js";

interface WizardTextFieldProps {
  label: string;
  value: string;
  onValueChange: (next: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoCapitalize?: string;
  spellCheck?: boolean;
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];
  className?: string;
}

// Same surface as `Input`, but compact (no indent, error only when present),
// 16px text so iOS does not zoom on focus, and full mobile keyboard hints.
const SURFACE =
  "w-full rounded-[18px] border bg-[rgba(33,33,33,0.9)] px-4 py-2.5 text-base font-medium text-[#dfdfdf] " +
  "outline-none transition-[border-color] duration-200 placeholder:text-gray/70";

export default function WizardTextField({
  label,
  value,
  onValueChange,
  onBlur,
  error,
  placeholder,
  multiline = false,
  rows = 3,
  type = "text",
  autoComplete,
  inputMode,
  autoCapitalize,
  spellCheck,
  enterKeyHint = "next",
  className = "",
}: WizardTextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const stateClass = error
    ? "border-rose-400 focus:border-rose-400/60"
    : "border-white/10 focus:border-green-500/60"; // visible on the bare page background (mobile)
  const aria = {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  return (
    <FieldShell
      compact
      label={label}
      htmlFor={id}
      error={error}
      errorId={errorId}
      className={className}
    >
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={onBlur}
          className={`${SURFACE} resize-y ${stateClass}`}
          {...aria}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          enterKeyHint={enterKeyHint}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={onBlur}
          className={`${SURFACE} ${stateClass}`}
          {...aria}
        />
      )}
    </FieldShell>
  );
}
