import React from "react";

interface IconProps {
  /** SVG component imported with `?react` */
  Svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Uniform size (overridden by width/height if both provided) */
  size?: string | number;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

function toCss(val: string | number): string {
  return typeof val === "number" ? `${val}px` : val;
}

/**
 * Lightweight, reusable SVG icon wrapper.
 * Accepts an SVG component (via `?react` import) and renders it inside a
 * sized container. Supports uniform `size` or independent `width`/`height`.
 * Pass `className` for positioning (e.g. `absolute left-[…] top-[…]`).
 */
export default function Icon({
  Svg,
  size,
  width,
  height,
  className = "",
  style = {},
}: IconProps) {
  const w = width ?? size;
  const h = height ?? size;

  const sizeStyle: React.CSSProperties = {
    ...(w != null ? { width: toCss(w) } : {}),
    ...(h != null ? { height: toCss(h) } : {}),
    ...style,
  };

  return (
    <div className={className} style={sizeStyle}>
      <Svg className="w-full h-full block" />
    </div>
  );
}
