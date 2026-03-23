import React from "react";
import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

type Props = {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
  iconWidth?: number;
  iconHeight?: number;
  iconWidthPercent?: number;
  iconPadding?: string;
  /** Global section scroll progress (0–1) from useScroll */
  scrollYProgress: MotionValue<number>;
  /** The [start, end] slice of scrollYProgress that drives this step */
  progressRange: [number, number];
};

const TITLE_STYLE = { fontSize: "clamp(28px, 8.5vw, 52px)" };
const TEXT_STYLE  = { fontSize: "clamp(12px, 3.5vw, 24px)" };

export default function HowItWorksStepMobile({
  imageSrc,
  title,
  subtitle,
  description,
  iconWidth = 200,
  iconHeight = 180,
  iconWidthPercent = 80,
  iconPadding,
  scrollYProgress,
  progressRange,
}: Props) {
  const p      = useTransform(scrollYProgress, progressRange, [0, 1], { clamp: true });
  const opacity = p;
  const scale   = useTransform(p, [0, 1], [0.85, 1]);
  const filter  = useTransform(p, (v) => `blur(${(1 - v) * 6}px)`);

  return (
    <motion.div
      style={{ opacity, scale, filter }}
      className="w-full flex flex-col items-center text-center"
    >
      <div className={`flex justify-center w-full ${iconPadding ? "pr-4" : ""}`}>
        <img
          src={imageSrc}
          alt={title}
          className="object-contain h-auto"
          style={{
            width: `${iconWidthPercent}%`,
            aspectRatio: `${iconWidth} / ${iconHeight}`,
          }}
        />
      </div>
      <h3
        className="text-white font-staatliches leading-none capitalize m-0 p-0 mt-2"
        style={TITLE_STYLE}
      >
        {title}
      </h3>
      <p
        className="text-gray italic leading-[1.2] m-0 p-0 mt-1.5 uppercase"
        style={{ ...TEXT_STYLE, textWrap: "pretty" } as React.CSSProperties}
      >
        {subtitle}
        <br />
        {description}
      </p>
    </motion.div>
  );
}
