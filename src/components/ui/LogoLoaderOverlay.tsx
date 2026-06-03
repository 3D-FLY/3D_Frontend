import LogoLoader from "./LogoLoader.js";

interface LogoLoaderOverlayProps {
  className?: string;
  size?: number;
  gap?: number;
  label?: string;
}

/** LogoLoader centered over a `relative` parent — not full-page. */
export default function LogoLoaderOverlay({
  className = "",
  size = 90,
  gap = 28,
  label = "Loading",
}: LogoLoaderOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-20 flex items-center justify-center bg-dark ${className}`}
      aria-busy="true"
      aria-label={label}
    >
      <LogoLoader size={size} gap={gap} />
    </div>
  );
}
