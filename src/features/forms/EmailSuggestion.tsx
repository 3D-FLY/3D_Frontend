import { suggestEmailFix } from "./emailTypos.js";

interface EmailSuggestionProps {
  email: string;
  onAccept: (fixed: string) => void;
  className?: string;
}

// Inline "Did you mean name@gmail.com?" under an email field. Click applies the fix.
export default function EmailSuggestion({ email, onAccept, className = "" }: EmailSuggestionProps) {
  const fixed = suggestEmailFix(email);
  if (!fixed) return null;
  return (
    <p className={`text-xs text-white/60 ${className}`} aria-live="polite">
      Did you mean{" "}
      <button
        type="button"
        onClick={() => onAccept(fixed)}
        className="font-semibold text-green-500 underline underline-offset-2 hover:text-green-500/80"
      >
        {fixed}
      </button>
      ?
    </p>
  );
}
