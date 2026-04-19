import React, { forwardRef, useId, useState } from "react";

// ─── Inline eye icons ─────────────────────────────────────────────────────────
// Closed eye  = password is currently hidden  (click to reveal)
// Open eye    = password is currently visible (click to hide)

function EyeHiddenIcon() {
  return (
    <svg width="28" height="19" viewBox="0 0 56 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1387_5530)">
        <path d="M35.04 7.47998L34.94 7.59998L33.59 9.26998C34.34 9.37998 35.09 9.52998 35.83 9.69998L37.13 8.08998L37.23 7.96998C36.51 7.78998 35.78 7.62998 35.04 7.47998ZM55 18.07C50.5 13.58 45.17 10.43 39.51 8.61998L38.15 10.3C43.42 11.86 48.42 14.64 52.69 18.63C44.6 26.19 33.91 29.39 23.62 28.21L22.14 30.04C33.77 31.76 46.04 28.14 55 19.18L55.55 18.63L55 18.07ZM0.55 18.07L0 18.63L0.55 19.18C4.95 23.58 10.14 26.69 15.66 28.51L17.01 26.84C11.88 25.26 7.02 22.52 2.86 18.63C10.83 11.17 21.33 7.94998 31.48 8.98998L32.97 7.15998C21.46 5.58998 9.39 9.22998 0.55 18.07ZM18.92 27.37L17.53 29.08C18.24 29.27 18.96 29.45 19.68 29.61L21.11 27.85C20.38 27.71 19.65 27.55 18.92 27.37Z" fill="currentColor"/>
        <path d="M34.8098 14.42L33.3998 16.16C33.6498 16.84 33.7798 17.58 33.7798 18.35C33.7798 21.94 30.8698 24.85 27.2798 24.85C26.9798 24.85 26.6898 24.83 26.3998 24.79L24.9898 26.53C25.7198 26.74 26.4898 26.85 27.2798 26.85C31.9698 26.85 35.7798 23.04 35.7798 18.35C35.7798 16.93 35.4298 15.59 34.8098 14.42ZM31.9698 11.27L30.7098 12.83C31.2798 13.18 31.7898 13.62 32.2298 14.13L33.4998 12.57C33.0498 12.07 32.5298 11.64 31.9698 11.27ZM27.2798 9.84998C22.5798 9.84998 18.7798 13.66 18.7798 18.35C18.7798 20.06 19.2798 21.64 20.1498 22.97L21.4898 21.31C21.0398 20.42 20.7798 19.41 20.7798 18.35C20.7798 14.76 23.6898 11.85 27.2798 11.85C27.8698 11.85 28.4398 11.93 28.9798 12.08L30.3298 10.42C29.3798 10.05 28.3498 9.84998 27.2798 9.84998ZM22.5798 22.84L21.3198 24.41C21.7898 24.88 22.3198 25.29 22.8998 25.64L24.1698 24.07C23.5798 23.74 23.0398 23.32 22.5798 22.84Z" fill="currentColor"/>
        <path d="M37.1299 8.08998L35.8299 9.69998L33.4999 12.57L32.2299 14.13L24.1799 24.07H24.1699L22.8999 25.64L21.1099 27.85L19.6799 29.61L13.6299 37.07C13.5099 37.22 13.3599 37.32 13.1899 37.38L11.8599 36.3C11.8799 36.13 11.9499 35.96 12.0699 35.81L17.5299 29.08L18.9199 27.37L21.3199 24.41L22.5799 22.84L30.7099 12.83L31.9699 11.27L33.5899 9.26998L34.9399 7.59998L37.1299 8.08998Z" fill="#222222"/>
        <path d="M42.3701 1.63L37.2301 7.97L37.1301 8.09L35.8301 9.7L33.5001 12.57L32.2301 14.13L24.1801 24.07H24.1701L22.9001 25.64L21.1101 27.85L19.6801 29.61L13.6301 37.07C13.5101 37.22 13.3601 37.32 13.1901 37.38C12.8701 37.5 12.5001 37.45 12.2201 37.22C11.9401 36.99 11.8101 36.63 11.8601 36.3C11.8801 36.13 11.9501 35.96 12.0701 35.81L17.5301 29.08L18.9201 27.37L21.3201 24.41L22.5801 22.84L30.7101 12.83L31.9701 11.27L33.5901 9.27L34.9401 7.6L35.0401 7.48L40.8101 0.370001C41.1601 -0.0599995 41.7901 -0.129999 42.2201 0.220001C42.6501 0.570001 42.7101 1.2 42.3701 1.63Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_1387_5530">
          <rect width="55.55" height="37.45" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function EyeVisibleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M54.1388 27.7774C39.5337 42.2173 16.023 42.2173 1.41788 27.7774C16.0228 13.3384 39.5339 13.3384 54.1388 27.7774Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="27.2783" cy="27.5" r="7.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Label rendered above the input, styled green + uppercase */
  label?: string;
  /** Validation error message rendered below the input */
  error?: string | undefined;
  /**
   * Enables password-visibility toggle.
   * When true (or when type="password"), an eye icon is rendered on the right.
   * The icon defaults to "hidden" state; clicking toggles input type between
   * "password" and "text".
   */
  password?: boolean;
  /** Rendered inside the field row (e.g. info icon); use `max-md:` / `md:hidden` in parent to scope to mobile */
  endAccessory?: React.ReactNode;
  /** Extra className applied to the outer wrapper div */
  wrapperClassName?: string;
};

/**
 * General-purpose input component.
 *
 * Width is controlled via `className` or `style` on the wrapper.
 * Height is driven by typography + vertical padding (not hardcoded).
 *
 * @example
 * <Input label="Email" placeholder="Enter your email" />
 * <Input label="Password" password placeholder="Create a password" />
 * <Input label="Username" error="Already taken" className="w-full" />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    password,
    type,
    className = "",
    wrapperClassName = "",
    endAccessory,
    ...props
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  const isPassword = password || type === "password";
  const resolvedType = isPassword ? (visible ? "text" : "password") : (type ?? "text");

  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-green text-sm font-medium uppercase tracking-widest select-none"
        >
          {label}
        </label>
      )}

      <div className="flex flex-col gap-0.5 pl-5">
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={resolvedType}
            className={[
              "w-full py-2 ",
              "bg-[rgba(33,33,33,0.9)]",
              "text-[#dfdfdf] font-medium tracking-widest",
              "placeholder:text-gray placeholder:uppercase placeholder:tracking-widest",
              "rounded-[18px] px-3",
              "border border-transparent",
              "outline-none transition-[border-color] duration-200",
              "[&:-webkit-autofill]:![box-shadow:0_0_0_1000px_#212121_inset]",
              "[&:-webkit-autofill]:![-webkit-text-fill-color:#dfdfdf]",
              "[&:-webkit-autofill]:!border-transparent",
              error
                ? "border-rose-400 focus:border-rose-400/45"
                : "focus:border-gray/50 focus-visible:border-gray/50",
              isPassword
              ? endAccessory
                ? "pr-12 max-md:pr-[4.25rem]"
                : "pr-12"
              : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {isPassword && endAccessory && (
            <div className="pointer-events-auto absolute right-[2.65rem] top-1/2 z-[1] flex -translate-y-1/2 items-center max-md:flex md:hidden">
              {endAccessory}
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#959595] transition-colors hover:text-white"
              tabIndex={-1}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? <EyeVisibleIcon /> : <EyeHiddenIcon />}
            </button>
          )}
        </div>

        <p
          className={[
            "min-h-[14px] text-[10px] uppercase tracking-wide leading-tight",
            error ? "text-rose-400" : "text-transparent",
          ].join(" ")}
          aria-live={error ? "polite" : undefined}
          {...(!error ? { "aria-hidden": true as const } : {})}
        >
          {error ? error : "\u00a0"}
        </p>
      </div>
    </div>
  );
});

export default Input;
