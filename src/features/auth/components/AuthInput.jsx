/**
 * Shared input component used across auth forms.
 *
 * Props:
 *  - label       string  — field label rendered above the input
 *  - type        string  — input type (text, email, password, …)
 *  - value       string
 *  - onChange    fn
 *  - placeholder string
 *  - error       string  — validation message shown below the input
 *  - rightElement ReactNode — icon(s) rendered inside the right edge of the input
 *  - className   string  — wrapper override
 *  - inputClassName string — input element override
 */
export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  rightElement,
  className = "",
  inputClassName = "",
  ...props
}) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-white/60 text-xs font-semibold uppercase tracking-widest select-none">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            "w-full bg-[#1c1c1c] text-white text-sm",
            "border rounded-xl px-4 py-3.5",
            "placeholder:text-gray/40",
            "outline-none transition-all duration-200",
            "focus:shadow-[0_0_0_1px_#5ac42233]",
            hasError
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-green",
            rightElement ? "pr-16" : "",
            inputClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {rightElement}
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </div>
  );
}
