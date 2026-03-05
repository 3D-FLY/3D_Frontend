import logoSvg from "../../assets/icons/logo.svg?url";

/**
 * Turtle – לוגו וקטורי (SVG). מחליף את הלוגו הישן באותו API.
 * - בלי icon: לוגו ממוקם (hero וכו') — מקבל bottom, left, translate וכו'.
 * - icon: רק לוגו עם גודל (נבבר, פוטר וכו') — מקבל רק className/style.
 * SVG נטען כ־img ולכן נשאר וקטורי (scale מושלם בכל רזולוציה).
 */
export default function Turtle({
  icon = false,
  width,
  height,
  left,
  right,
  top,
  bottom,
  translateX = "-50%",
  translateY = "35%",
  opacity = 0.7,
  zIndex = 0,
  className = "",
  style = {},
}) {
  if (icon) {
    return (
      <img
        src={logoSvg}
        alt=""
        aria-hidden
        className={`object-contain ${className}`.trim()}
        style={style}
      />
    );
  }

  const imgStyle = {
    left,
    right,
    top,
    bottom,
    height,
    transform: `translate(${translateX}, ${translateY})`,
    opacity,
    zIndex,
    objectFit: "contain",
    ...style,
  };

  if (imgStyle.left == null && imgStyle.right == null) imgStyle.left = "50%";
  if (imgStyle.bottom == null && imgStyle.top == null) imgStyle.bottom = "0%";

  if (width && !className.includes("w-")) {
    imgStyle.width = width;
  } else if (height) {
    imgStyle.width = imgStyle.width ?? "auto";
    if (imgStyle.maxWidth == null) imgStyle.maxWidth = "none";
  }

  return (
    <img
      src={logoSvg}
      alt=""
      aria-hidden
      className={`pointer-events-none select-none absolute ${className}`}
      style={imgStyle}
    />
  );
}
