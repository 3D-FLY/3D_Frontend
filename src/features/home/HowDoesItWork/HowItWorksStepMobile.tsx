import React from "react";

/** אנימציית Step Build Sequence – רק מובייל/טאבלט */
const CARD_REVEAL_MS = 800;
const REVEAL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

type Props = {
  imageSrc: string;
  title: string;
  subtitle: string;
  description: string;
  iconWidth?: number;
  iconHeight?: number;
  /** רוחב התמונה כאחוז מרוחב הכרטיס (270px) – רספונסיבי */
  iconWidthPercent?: number;
  iconPadding?: string;
  inView?: boolean;
  index?: number;
  /** delay לפני הופעת הכרטיס (ms) – למובייל: רצף Step Build */
  revealDelayMs?: number;
};

const TITLE_STYLE = { fontSize: "clamp(28px, 8.5vw, 52px)" };
const TEXT_STYLE = { fontSize: "clamp(12px, 3.5vw, 24px)" };

export default function HowItWorksStepMobile({
  imageSrc,
  title,
  subtitle,
  description,
  iconWidth = 200,
  iconHeight = 180,
  iconWidthPercent = 80,
  iconPadding,
  inView = false,
  index = 0,
  revealDelayMs = 0,
}: Props) {
  const delay = revealDelayMs;
  const animStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? "scale(1)" : "scale(0.85)",
    filter: inView ? "blur(0px)" : "blur(6px)",
    transition: `opacity ${CARD_REVEAL_MS}ms ${REVEAL_EASING} ${delay}ms, transform ${CARD_REVEAL_MS}ms ${REVEAL_EASING} ${delay}ms, filter ${CARD_REVEAL_MS}ms ${REVEAL_EASING} ${delay}ms`,
  };

  const iconPaddingMobile = iconPadding ? "pr-4" : "";

  return (
    <div style={animStyle} className="w-full flex flex-col items-center text-center">
      <div className={`flex justify-center w-full ${iconPaddingMobile}`}>
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
        className="text-gray italic leading-[1.2] m-0 p-0 mt-1.5"
        style={{ ...TEXT_STYLE, fontVariant: "small-caps", textWrap: "pretty" } as React.CSSProperties}
      >
        {subtitle}
        <br />
        {description}
      </p>
    </div>
  );
}