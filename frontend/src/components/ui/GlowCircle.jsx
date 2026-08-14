export default function GlowCircle({
  size = 700,
  blur = 140,
  opacity = 0.4,
  color = "149,149,149",
  className = "",
}) {
  const style = {
    width: typeof size === "number" ? `${size}px` : size,
    height: typeof size === "number" ? `${size}px` : size,
    background: `rgba(${color}, ${opacity})`,
    filter: `blur(${blur}px)`,
  };

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={style}
    />
  );
}