import GlowCircle from "./GlowCircle.jsx";

/** Full-bleed ambient glow layer (three `GlowCircle` orbs). Reuse on auth, landing, etc. */
export default function AmbientGlowBackdrop({
  className = "",
  zIndexClass = "z-[1]",
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${zIndexClass} ${className}`}
      aria-hidden
    >
      <GlowCircle
        size="min(90vw, 360px)"
        blur={600}
        opacity={0.4}
        className="right-0 top-0 max-h-[360px] max-w-[360px] translate-x-[18%] -translate-y-[22%]"
      />
      <GlowCircle
        size="min(85vw, 320px)"
        blur={600}
        opacity={0.4}
        className="bottom-0 left-0 max-h-[320px] max-w-[320px] -translate-x-[32%] translate-y-[28%]"
      />
      <GlowCircle
        size="min(80vw, 300px)"
        blur={600}
        opacity={0.4}
        className="bottom-0 right-0 max-h-[300px] max-w-[300px] translate-x-[30%] translate-y-[32%]"
      />
    </div>
  );
}
