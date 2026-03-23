import userUrl from "../../../assets/icons/user.svg?url";

/**
 * Reusable user / profile icon.
 * Rendered as an <img> so the green fill in the SVG is preserved exactly.
 * Pass className for sizing and positioning (e.g. "h-[27px] w-[27px]").
 */
export default function UserIcon({ className = "" }) {
  return (
    <img
      src={userUrl}
      alt=""
      aria-hidden
      draggable={false}
      className={`select-none pointer-events-none block ${className}`}
    />
  );
}
