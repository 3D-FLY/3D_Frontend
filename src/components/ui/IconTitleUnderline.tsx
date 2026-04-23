type Variant = "tall" | "flat";

const variants = {
  tall: { viewBox: "0 0 917 47", path: "M66.2472 0H917L850.753 47H0L66.2472 0Z" },
  flat: { viewBox: "0 0 1298 34", path: "M93.7719 0H1298L1204.23 34H0L93.7719 0Z" },
};

export default function IconTitleUnderline({
  className = "",
  variant = "tall",
}: {
  className?: string;
  variant?: Variant;
}) {
  const { viewBox, path } = variants[variant];
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden
      className={`absolute w-full ${className}`}
      style={{ height: "50%" }}
    >
      <path d={path} fill="#5AC422" fillOpacity="0.4" />
    </svg>
  );
}