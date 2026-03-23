import IconTooltipBubble from "../../../components/ui/input/IconTooltipBubble.jsx";

/**
 * Floating tooltip that shows password requirements.
 * Triggered by hovering the IconPasswordInfo button inside the password field.
 *
 * Props:
 *  - password  string  — current password; each rule uses test() for live validation
 *  - visible   boolean — controlled by parent hover state
 */

const RULES = [
  {
    id: "length",
    label: "8+ characters",
    test: (pw) => pw.length >= 8,
  },
  {
    id: "upper",
    label: "Uppercase",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    id: "lower",
    label: "Lowercase",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    id: "number",
    label: "Number",
    test: (pw) => /\d/.test(pw),
  },
  {
    id: "special",
    label: "Special character",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

export default function PasswordRulesTooltip({ password = "", visible }) {
  if (!visible) return null;

  return (
    <div
      role="tooltip"
      className="absolute z-[100] bottom-[calc(100%+2px)] left-[65%] w-52"
    >
      {/* SVG bubble background — fills the container */}
      <IconTooltipBubble className="absolute inset-0 w-full h-full" />

      {/* Content — padded to stay within the bubble (90% of height from top) */}
      <div className="relative z-10 px-4 pt-3 pb-10">
        <p className="text-black text-xs font-medium italic uppercase mb-1">
          Password must contain:
        </p>

        <ul className="flex flex-col pl-2">
          {RULES.map(({ id, label, test }) => {
            const passed = test(password);
            return (
              <li
                key={id}
                className="flex items-center gap-2"
                data-rule-passed={passed}
              >
                <span className="text-black font-medium italic text-xs leading-none flex-shrink-0">
                  ●
                </span>
                <span className="text-black text-xs font-medium italic uppercase leading-snug">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
