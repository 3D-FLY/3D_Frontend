import TurtleLogo from "../assets/images/3DFlyLogoTest.png";

export default function Turtle({
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
  const imgStyle = {
    left,
    right,
    top,
    bottom,
    height,
    transform: `translate(${translateX}, ${translateY})`,
    opacity,
    zIndex,
    ...style,
  };

  // ברירת מחדל – כמו שהיה אצלך: באמצע למטה
  if (imgStyle.left == null && imgStyle.right == null) imgStyle.left = "50%";
  if (imgStyle.bottom == null && imgStyle.top == null) imgStyle.bottom = "0%";

  if (width && !className.includes("w-")) {
    imgStyle.width = width;
  }

  return (
    <img
      src={TurtleLogo}
      alt=""
      aria-hidden
      className={`pointer-events-none select-none absolute ${className}`}
      style={imgStyle}
    />
  );
}
