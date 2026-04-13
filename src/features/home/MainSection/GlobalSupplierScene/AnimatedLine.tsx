import React from "react";
import type { MotionProps } from "framer-motion";
import { motion } from "framer-motion";

type AnimatedLineProps = {
  Svg: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function AnimatedLine({
  Svg,
  delay = 0,
  duration = 0.9,
  className = "",
  style,
}: AnimatedLineProps) {
  // Clip reveals from TOP → BOTTOM:
  //   initial  inset(0 0 100% 0)  = clips 100 % from bottom  → nothing visible
  //   animate  inset(0 0 0% 0)    = no clip                  → fully visible
  // All four SVGs are oriented so the TURTLE end is at the TOP of the div
  // and the EARTH/PIN end is at the BOTTOM, making the line appear to grow
  // outward from the turtle toward each destination pin.
  //
  // ease: "linear" keeps the reveal speed constant so the line visually
  // reaches its pin at exactly t = delay + duration (before the pin drops).
  const common = {
    initial:    { clipPath: "inset(0 0 100% 0)", opacity: 0 },  // ← הוסיפי opacity: 0
    animate:    { clipPath: "inset(0 0 0% 0)",   opacity: 1 },
    transition: { delay, duration, ease: "linear" as const },
    className,
  };

  if (style === undefined) {
    return (
      <motion.div {...common}>
        <Svg className="w-full h-full block" preserveAspectRatio="none" />
      </motion.div>
    );
  }

  return (
    <motion.div
      {...common}
      style={style as NonNullable<MotionProps["style"]>}
    >
      <Svg className="w-full h-full block" preserveAspectRatio="none" />
    </motion.div>
  );
}
