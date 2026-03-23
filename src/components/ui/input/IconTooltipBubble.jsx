import UnionSvg from "./Union.svg?react";

/**
 * Tooltip bubble background — the speech-bubble shape from Union.svg.
 * Used as the background container for PasswordRulesTooltip.
 */
export default function IconTooltipBubble({ className = "", ...props }) {
  return (
    <UnionSvg
      aria-hidden
      className={`w-full h-full ${className}`}
      {...props}
    />
  );
}
