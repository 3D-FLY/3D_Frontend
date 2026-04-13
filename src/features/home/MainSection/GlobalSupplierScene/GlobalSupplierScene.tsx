// GlobalSupplierScene.tsx
import React from "react";
import Earth from "./Earth.js";
import LocationPin from "./LocationPin.js";
import AnimatedLinesCanvas from "./AnimatedLinesCanvas.js";
import Turtle from "../../../../components/ui/Turtle.jsx";

const TURTLE_STACK_BOTTOM    = "34%";
const TURTLE_STACK_WIDTH     = "65%";
const TURTLE_GLOW_WIDTH_PCT  = "90%";
const TURTLE_LOGO_FINE_CLASS = "";

/**
 * הזזת כל הסצנה למטה (אחוז מגובה **האלמנט** — רוחב/יחס 41:40).
 * משמש כדי שכדור הארץ “יבלוט” מעט מתחת לפריים; יחד עם overflow ב-MainSection.
 */
// ── נקודות יציאה מהצב (% של הסצנה) ──────────────────────────────────────────
// הצב: left=12.2%, width=75.6%, bottom=37% → top ≈ 14%,  height ≈ 54%
// נקודות מחושבות: left + (relX × width),  top + (relY × height)
const OFFSET_X = -12; // הזז שמאלה — שני את המספר
const OFFSET_Y = 41;  // הזז למטה — שני את המספר
const TURTLE_Y_WINGS = 5.4;  // Y של קווים 1 ו-4
const TURTLE_Y_BODY  = 8.5;  // Y של קווים 2 ו-3

const linesConfig = [
  {
    // קו 1 — מהצב לגלוב
    start: { x: 53 + OFFSET_X, y: TURTLE_Y_WINGS + OFFSET_Y }, // צב
    ctrl:  { x: 18.5 + OFFSET_X, y: 12 + OFFSET_Y },
    ctrl2: { x: 15   + OFFSET_X, y: 15   + OFFSET_Y },
    end:   { x: 20 + OFFSET_X, y: 45 + OFFSET_Y }, // גלוב
    endX:  18.5 + OFFSET_X, endY: 41.9 + OFFSET_Y, pinWidth: "5%",
  },
  {
    // קו 2 — מהצב לגלוב
    start: { x: 50 + OFFSET_X, y: TURTLE_Y_BODY + OFFSET_Y }, // צב
    ctrl:  { x: 29 + OFFSET_X, y: 25 + OFFSET_Y },
    ctrl2: { x: 15   + OFFSET_X, y: 48.2 + OFFSET_Y },
    end:   { x: 34 + OFFSET_X, y: 46 + OFFSET_Y }, // גלוב
    endX:  32.6 + OFFSET_X, endY: 46.5 + OFFSET_Y, pinWidth: "5.5%",
  },
  {
    // קו 3
    start: { x: 74 + OFFSET_X, y: TURTLE_Y_BODY + OFFSET_Y },
    ctrl:  { x: 90 + OFFSET_X, y: 20 + OFFSET_Y },
    ctrl2: { x: 90.7 + OFFSET_X, y: 55.5 + OFFSET_Y },
    end:   { x: 89 + OFFSET_X, y: 38.2 + OFFSET_Y },
    endX:  86 + OFFSET_X, endY: 39 + OFFSET_Y, pinWidth: "5.5%",
  },
  {
    // קו 4
    start: { x: 73.0 + OFFSET_X, y: TURTLE_Y_WINGS + OFFSET_Y },
    ctrl:  { x: 99 + OFFSET_X, y: 10 + OFFSET_Y },
    ctrl2: { x: 100 + OFFSET_X, y: 70 + OFFSET_Y },
    end:   { x: 103 + OFFSET_X, y: 43 + OFFSET_Y },
    endX:  100 + OFFSET_X, endY: 43.5 + OFFSET_Y, pinWidth: "4.5%",
  },
];

interface GlobalSupplierSceneProps {
  className?: string;
}

export default function GlobalSupplierScene({ className = "" }: GlobalSupplierSceneProps) {
  const lineDuration = 0.8;
  const stagger      = 0.22;

  // סדר: 1 → 3 → 4 → 2
  const line1Delay = 0.2;
  const line3Delay = line1Delay + stagger;
  const line4Delay = line3Delay + stagger;
  const line2Delay = line4Delay + stagger;

  const pin1Delay  = line1Delay + lineDuration + 0.05;
  const pin3Delay  = line3Delay + lineDuration + 0.05;
  const pin4Delay  = line4Delay + lineDuration + 0.05;
  const pin2Delay  = line2Delay + lineDuration + 0.05;

  const delays = [
    { line: line1Delay, pin: pin1Delay },
    { line: line2Delay, pin: pin2Delay },
    { line: line3Delay, pin: pin3Delay },
    { line: line4Delay, pin: pin4Delay },
  ];

  return (
    <div
      className={`absolute bottom-0 left-1/2 pointer-events-none ${className}`.trim()}
      style={{
        width:       "100vw",
        aspectRatio: "41 / 40",
        transform:   "translateX(-50%)",
      }}
    >
      {/* Earth */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <Earth className="w-full h-auto block z-10" />
      </div>

      {/* Turtle + glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ bottom: TURTLE_STACK_BOTTOM, width: TURTLE_STACK_WIDTH }}
      >
        <div className="relative w-full">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width:       TURTLE_GLOW_WIDTH_PCT,
              aspectRatio: "1",
              background:  "rgba(149, 149, 149, 0.4)",
              filter:      "blur(10vw)",
            }}
          />
          <Turtle
            icon
            className={`w-full h-auto relative z-10 block pointer-events-none select-none z-20 ${TURTLE_LOGO_FINE_CLASS}`.trim()}
            style={{ opacity: 1 }}
          />
        </div>
      </div>

      {/* ── Canvas לכל הקווים (z-15, מאחורי הצב) ── */}
      <AnimatedLinesCanvas
        className="z-15"
        lines={linesConfig.map((line, i) => ({
          start:    line.start,
          ctrl:     line.ctrl,
          end:      line.end,
          delay:    delays[i]!.line,
          duration: lineDuration,
        }))}
      />

      {/* ── Pins (z-30) ── */}
      {linesConfig.map((line, i) => (
        <LocationPin
          key={i}
          left={`${line.endX}%`}
          top={`${line.endY}%`}
          width={line.pinWidth}
          delay={delays[i]!.pin}
          // כוון כאן עם offsetX/offsetY אם צריך כוונון עדין
          offsetX={0}
          offsetY={0}
          className="z-25"
        />
      ))}
    </div>
  );
}