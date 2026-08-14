import XSvg from "../assets/icons/X.svg?react";

/**
 * אייקון סגירה (X) — לשימוש בכפתור סגירת תפריט/פופאפ במובייל.
 * צבע יורש מ־className (למשל text-green).
 */
export default function IconClose({ className = "", ...props }) {
  return (
    <XSvg
      aria-hidden
      className={className}
      {...props}
    />
  );
}
