import HamburgerSvg from "../../../assets/icons/HamburgerMenu.svg?react";

/**
 * אייקון תפריט ניווט (המבורגר) — לשימוש בנבבר במובייל/טאבלט.
 * צבע יורש מ־className (למשל text-green).
 */
export default function IconNavMenu({ className = "", ...props }) {
  return (
    <HamburgerSvg
      aria-hidden
      className={className}
      {...props}
    />
  );
}
