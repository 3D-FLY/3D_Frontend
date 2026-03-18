import React from "react";
import earthUrl from "../../../../assets/icons/section-main/Earth.svg?url";

interface EarthProps {
  className?: string;
}

/**
 * Earth globe SVG rendered as an <img> for performance.
 * The SVG source is large (~300 KB) so we avoid inlining it.
 */
export default function Earth({ className = "" }: EarthProps) {
  return (
    <img
      src={earthUrl}
      alt=""
      aria-hidden
      draggable={false}
      className={`block w-full h-auto select-none pointer-events-none ${className}`.trim()}
    />
  );
}
