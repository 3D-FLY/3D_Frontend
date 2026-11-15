import type { ReactNode } from "react";

interface FieldShellProps {
  label?: string | undefined;
  /** id of the control the label points to (omit for groups, which use labelId) */
  htmlFor?: string | undefined;
  /** id for the label element, used by aria-labelledby on groups */
  labelId?: string | undefined;
  error?: string | undefined;
  /** id for the error line, referenced by aria-describedby */
  errorId?: string | undefined;
  /**
   * Compact layout: no left indent, sentence-case white label, and the error
   * line only takes space when there is an error. Default keeps the `Input` look.
   */
  compact?: boolean;
  children: ReactNode;
  className?: string;
}

// Label + control + error line, laid out like `Input` (or compact for long forms).
export default function FieldShell({
  label,
  htmlFor,
  labelId,
  error,
  errorId,
  compact = false,
  children,
  className = "",
}: FieldShellProps) {
  if (compact) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <label
            id={labelId}
            htmlFor={htmlFor}
            className="select-none text-[15px] font-semibold leading-snug text-white"
          >
            {label}
          </label>
        )}
        {children}
        {error && (
          <p id={errorId} className="text-xs font-medium text-rose-400" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          id={labelId}
          htmlFor={htmlFor}
          className="select-none text-sm font-medium uppercase tracking-widest text-green-500"
        >
          {label}
        </label>
      )}
      <div className="flex flex-col gap-0.5 pl-5">
        {children}
        <p
          id={errorId}
          className={`min-h-[14px] text-[10px] uppercase leading-tight tracking-wide ${
            error ? "text-rose-400" : "text-transparent"
          }`}
          aria-live={error ? "polite" : undefined}
        >
          {error ? error : " "}
        </p>
      </div>
    </div>
  );
}
