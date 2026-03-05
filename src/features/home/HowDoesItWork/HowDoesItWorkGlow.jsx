import React from "react";
import GlowCircle from "../../../components/ui/GlowCircle";

const GLOW_COLOR = "149, 149, 149";

/**
 * עיגולי גלואו לסקשיין "How Does It Work".
 * דסקטופ: שני עיגולים (ימין למעלה, שמאל למטה).
 * מובייל/טאבלט: שלושה עיגולים — ימין למעלה, באמצע מימין (חצי מחוץ), לקראת סוף משמאל (חצי מחוץ).
 */
export default function HowDoesItWorkGlow() {
  return (
    <>
      {/* ========== DESKTOP (lg+) ========== */}
      <GlowCircle
        size={450}
        blur={600}
        opacity={0.8}
        color={GLOW_COLOR}
        className="top-0 right-0 translate-x-[20%] translate-y-[20%] z-0 hidden lg:block"
      />
      <GlowCircle
        size={356}
        blur={600}
        opacity={0.4}
        color={GLOW_COLOR}
        className="bottom-0 left-0 translate-x-[20%] translate-y-[60%] z-0 hidden lg:block"
      />

      {/* ========== MOBILE / TABLET ========== */}
      {/* ימין למעלה */}
      <GlowCircle
        size={400}
        blur={400}
        opacity={0.9}
        color={GLOW_COLOR}
        className="top-0 right-0 translate-x-[30%] -translate-y-[20%] z-0 lg:hidden"
      />
      {/* באמצע הסקשיין מימין — חצי מחוץ לחלון */}
      <GlowCircle
        size={150}
        blur={200}
        opacity={0.5}
        color={GLOW_COLOR}
        className="right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0 lg:hidden"
      />
      {/* לקראת סוף הסקשיין משמאל — חצי מחוץ לחלון */}
      <GlowCircle
        size={150}
        blur={200}
        opacity={0.5}
        color={GLOW_COLOR}
        className="left-0 top-[80%] -translate-y-1/2 -translate-x-1/2 z-0 lg:hidden"
      />
    </>
  );
}
