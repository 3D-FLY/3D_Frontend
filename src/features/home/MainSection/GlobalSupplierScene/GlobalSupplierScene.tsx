// GlobalSupplierScene.tsx
import React from "react";
import Earth from "./Earth.js";
import LocationPin from "./LocationPin.js";
import CurvedDashedLine from "./CurvedDashedLine.js";
import Turtle from "../../../../components/ui/Turtle.jsx";

const TURTLE_STACK_BOTTOM    = "37%";
const TURTLE_STACK_WIDTH     = "75.6%";
const TURTLE_GLOW_WIDTH_PCT  = "90%";
const TURTLE_LOGO_FINE_CLASS = "";

// ── נקודות יציאה מהצב (% של הסצנה) ──────────────────────────────────────────
// הצב: left=12.2%, width=75.6%, bottom=37% → top ≈ 14%,  height ≈ 54%
// נקודות מחושבות: left + (relX × width),  top + (relY × height)
const EXITS = {
  leftWing:  { x: 40, y: 40 },
  leftBody:  { x: 37.9, y: 40 },
  rightBody: { x: 62.1, y: 31 },
  rightWing: { x: 86.9, y: 25 },
};

const linesConfig = [
  {
    start:    EXITS.leftWing,
    ctrl:     { x: 7.3,  y: 17.7 },
    end:      { x: 13.5, y: 73 },  // ← זו נקודת הסוף
    endX:     13.5,  // ← הפין נוחת כאן
    endY:     97.0,  // ← הפין נוחת כאן
    pinWidth: "5%",
  },
  {
    start:    EXITS.leftBody,
    ctrl:     { x: 22, y: 54 },
    end:      { x: 22.6, y: 70 },
    endX:     22.6, endY: 70,  pinWidth: "5.5%",
  },
  {
    start:    EXITS.rightBody,
    ctrl:     { x: 78, y: 50 },
    end:      { x: 74.8, y: 62 },
    endX:     74.8, endY: 62,  pinWidth: "5%",
  },
  {
    start:    EXITS.rightWing,
    ctrl:     { x: 97, y: 50 },
    end:      { x: 89.2, y: 70 },
    endX:     89.2, endY: 70,  pinWidth: "4.5%",
  },
];

interface GlobalSupplierSceneProps {
  className?: string;
}

export default function GlobalSupplierScene({ className = "" }: GlobalSupplierSceneProps) {
  const lineDuration = 0.9;
  const gap          = 0.15;

  const line1Delay = 0.2;
  const pin1Delay  = line1Delay + lineDuration + 0.1;
  const line2Delay = pin1Delay  + gap;
  const pin2Delay  = line2Delay + lineDuration + 0.1;
  const line3Delay = pin2Delay  + gap;
  const pin3Delay  = line3Delay + lineDuration + 0.1;
  const line4Delay = pin3Delay  + gap;
  const pin4Delay  = line4Delay + lineDuration + 0.1;

  const delays = [
    { line: line1Delay, pin: pin1Delay },
    { line: line2Delay, pin: pin2Delay },
    { line: line3Delay, pin: pin3Delay },
    { line: line4Delay, pin: pin4Delay },
  ];

  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none ${className}`.trim()}
      style={{ width: "100vw", aspectRatio: "41 / 40" }}
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

      {/* ── SVG אחד לכל הקווים (z-10, מאחורי הצב) ── */}
      <svg
        className="absolute inset-0 w-full h-full z-15 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <style>{`
          @keyframes drawLine {
            to { stroke-dashoffset: 0; }
          }
        `}</style>

        {linesConfig.map((line, i) => (
          <CurvedDashedLine
            key={i}
            start={line.start}
            ctrl={line.ctrl}
            end={line.end}
            delay={delays[i]!.line}
            duration={lineDuration}
          />
        ))}
      </svg>

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