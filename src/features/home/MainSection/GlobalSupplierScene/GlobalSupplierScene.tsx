import React from "react";
import Earth from "./Earth.js";
import Line1 from "../../../../assets/icons/section-main/line1.svg?react";
import Line2 from "../../../../assets/icons/section-main/line2.svg?react";
import Line3 from "../../../../assets/icons/section-main/line3.svg?react";
import Line4 from "../../../../assets/icons/section-main/line4.svg?react";
import AnimatedLine from "./AnimatedLine.js";
import LocationPin from "./LocationPin.js";
import Turtle from "../../../../components/ui/Turtle.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Scene container reference frame: 100 vw × 97.56 vw
//
//   Width  = 100 vw  (matches viewport exactly – no side overhang)
//   Height = 100 vw × (40/41) = 97.56 vw  (aspect-ratio 41:40)
//
// Previously the container was 120 vw wide (centred, ±10 vw overhang).
// All horizontal % values have been rescaled with:
//
//   new_left%     = old_left% × 1.2 − 10   (shift to viewport-local origin)
//   new_width%    = old_width% × 1.2        (grow to fill same viewport px)
//   new_endX%     = old_endX% × 1.2 − 10
//   new_pinWidth% = old_pinWidth% × 1.2
//
// Vertical % values (top, height, endY, bottom) are unchanged because
// the container HEIGHT is kept identical (97.56 vw) – only the width changed.
//
// Earth SVG: 411 × 136 px  → at 100 vw: height = (136/411)×100 vw ≈ 33.1 vw
//   Earth top from scene bottom ≈ 33.1 / 97.56 × 100 ≈ 33.9 % of scene height
//
// Turtle: 75.6 vw wide → height ≈ 51.4 vw; SVG has ~9 % bottom whitespace
//   At bottom: 32 %  → visible tail sits ~11 px above Earth top   (gap ✓)
// ─────────────────────────────────────────────────────────────────────────────

const linesConfig = [
  {
    // line1 – left arc: turtle left-wing → far-left pin
    Svg: Line1,
    left:      8.4,   // 15.3 × 1.2 − 10
    top:      32.3,   // unchanged
    width:    32.5,   // 27.1 × 1.2
    height:   32.3,   // unchanged
    endX:      8.6,   // 15.5 × 1.2 − 10
    endY:     64.3,   // unchanged
    pinWidth:  5.1,   // 4.2 × 1.2
  },
  {
    // line2 – left arc: turtle body → left-centre pin
    Svg: Line2,
    left:     21.8,   // 26.5 × 1.2 − 10
    top:      36.1,   // unchanged
    width:    16.2,   // 13.5 × 1.2
    height:   34.2,   // unchanged
    endX:     22.6,   // 27.2 × 1.2 − 10
    endY:     70.1,   // unchanged
    pinWidth:  6.0,   // 5.0 × 1.2
  },
  {
    // line3 – right arc: turtle body → right-centre pin
    Svg: Line3,
    left:     59.7,   // 58.1 × 1.2 − 10
    top:      35.1,   // unchanged
    width:    15.2,   // 12.7 × 1.2
    height:   25.7,   // unchanged
    endX:     74.8,   // 70.7 × 1.2 − 10
    endY:     60.5,   // unchanged
    pinWidth:  5.2,   // 4.3 × 1.2
  },
  {
    // line4 – right arc: turtle right-wing → far-right pin
    Svg: Line4,
    left:     59.4,   // 57.8 × 1.2 − 10
    top:      32.3,   // unchanged
    width:    30.1,   // 25.1 × 1.2
    height:   33.2,   // unchanged
    endX:     89.2,   // 82.7 × 1.2 − 10
    endY:     65.3,   // unchanged
    pinWidth:  3.6,   // 3.0 × 1.2
  },
];

interface GlobalSupplierSceneProps {
  /** Extra Tailwind classes (e.g. `"xl:hidden"`) forwarded to the root element. */
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
    /*
     * ── Composition root ──────────────────────────────────────────────────────
     * 100 vw wide (no overhang), fixed aspect-ratio 41:40.
     * Height = 100 vw × 40/41 ≈ 97.56 vw – scales with viewport WIDTH only.
     * Anchored to the section's bottom edge.
     * overflow-hidden intentionally omitted so the glow can bleed upward.
     */
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none ${className}`.trim()}
      style={{ width: "100vw", aspectRatio: "41 / 40" }}
    >

      {/* ── Earth (z-10) ─────────────────────────────────────────────────────
          Full viewport width, pinned to scene bottom.
          Earth SVG 411 × 136 → height ≈ 33.1 vw → top at ≈ 33.9 % of scene.
      */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <Earth className="w-full h-auto block" />
      </div>

      {/* ── Turtle + glow (z-20) ─────────────────────────────────────────────
          Width  = 75.6 % of container (= 75.6 vw; same absolute size as before)
          bottom = 32 % → visible turtle tail sits ~11 px above Earth top arc.
          Glow is centred on the turtle container (90 % width, blur scales with vw).
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ bottom: "32%", width: "75.6%" }}
      >
        {/* Proportional glow – no fixed pixel sizes */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width:       "90%",
            aspectRatio: "1",
            background:  "rgba(149, 149, 149, 0.4)",
            filter:      "blur(10vw)",
          }}
        />
        <Turtle className="w-full h-auto relative z-10" opacity={1} />
      </div>

      {/* ── Lines (z-10, drawn behind turtle) + Pins (z-30) ─────────────────── */}
      {linesConfig.map((line, index) => {
        const delay = delays[index];
        if (!delay) return null;
        return (
          <React.Fragment key={index}>
            <AnimatedLine
              Svg={line.Svg}
              delay={delay.line}
              duration={lineDuration}
              className="absolute z-10"
              style={{
                left:   `${line.left}%`,
                top:    `${line.top}%`,
                width:  `${line.width}%`,
                height: `${line.height}%`,
              }}
            />
            <LocationPin
              left={`${line.endX}%`}
              top={`${line.endY}%`}
              width={`${line.pinWidth}%`}
              delay={delay.pin}
            />
          </React.Fragment>
        );
      })}

    </div>
  );
}
