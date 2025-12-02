import LogoSvg from "../assets/logo.svg?react";

// טיפ: ודא שבתוך ה־SVG אין fill קשיח (#000 וכו'). אם יש – החלף ל: fill="currentColor"
export default function Logo(props) {
  return <LogoSvg aria-label="Logo" {...props} />;
}
