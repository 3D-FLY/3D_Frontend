import FooterLogoSvg from "../assets/footer-logo.svg?react";

// טיפ: ודא שבתוך ה־SVG אין fill קשיח (#000 וכו'). אם יש – החלף ל: fill="currentColor"
export default function FooterLogo(props) {
  return <FooterLogoSvg aria-label="Footer Logo" {...props} />;
}

