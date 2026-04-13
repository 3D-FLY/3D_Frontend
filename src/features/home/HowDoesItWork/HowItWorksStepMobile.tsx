import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
  iconWidth?: number;
  iconHeight?: number;
  iconWidthPercent?: number;
  iconPadding?: string;
  /** true once the section has enough visibility (see HowDoesItWork observer) */
  reveal: boolean;
  stepIndex: number;
  staggerSeconds?: number;
  durationSeconds?: number;
};

const TITLE_STYLE = { fontSize: "clamp(28px, 8.5vw, 52px)" };
const TEXT_STYLE  = { fontSize: "clamp(12px, 3.5vw, 24px)" };

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HowItWorksStepMobile({
  imageSrc,
  title,
  subtitle,
  description,
  iconWidth = 200,
  iconHeight = 180,
  iconWidthPercent = 80,
  iconPadding,
  reveal,
  stepIndex,
  staggerSeconds = 0.52,
  durationSeconds = 0.72,
}: Props) {
  const reduceMotion = useReducedMotion();

  const delay    = reduceMotion ? 0 : stepIndex * staggerSeconds;
  const duration = reduceMotion ? 0 : durationSeconds;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
      animate={
        reveal
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.85, filter: "blur(6px)" }
      }
      transition={{ delay, duration, ease: EASE }}
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
