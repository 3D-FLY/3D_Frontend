import { Link } from "react-router-dom";

interface LegalConsentProps {
  /** Text before "Terms of Service" */
  intro: string;
  /** Text after "Privacy Policy" (e.g. a final period) */
  outro?: string;
  className?: string;
}

const LINK_CLASS = "text-green-500 underline-offset-2 hover:underline";

// Consent sentence whose legal names link to the legal pages (new tab keeps the form).
export default function LegalConsent({
  intro,
  outro = "",
  className = "",
}: LegalConsentProps) {
  return (
    <p className={`text-[13px] leading-relaxed text-white/50 ${className}`}>
      {intro}
      <Link to="/terms" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        Privacy Policy
      </Link>
      {outro}
    </p>
  );
}
