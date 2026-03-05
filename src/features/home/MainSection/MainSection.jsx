import React from "react";
import Button from "../../../components/ui/Button";
import Turtle from "../../../components/ui/Turtle";
import MainSectionGlow from "./MainSectionGlow";

export default function MainSection() {
  return (
    <section className="relative w-full min-h-[calc(100svh-72px)] overflow-hidden bg-dark">
      {/* אנימציה אחידה: עלייה מלמטה למעלה */}
      <style>{`
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseUpTurtle {
          from { opacity: 0; transform: translate(-50%, 37%) translateY(36px); }
          to   { opacity: 0.7; transform: translate(-50%, 37%) translateY(0); }
        }
        @keyframes riseUpTurtleMobile {
          from { opacity: 0; transform: translate(-50%, 40%) translateY(36px); }
          to   { opacity: 0.7; transform: translate(-50%, 40%) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-riseUp { animation: none !important; }
        }
      `}</style>

      {/* ===== GLOW BACKGROUND ===== */}

      <MainSectionGlow />


      {/* ===== TURTLE (מאחורה!) ===== */}
      {/* מובייל + טאבלט: צב נוטה למרכז */}
      <Turtle
        bottom="28%"
        translateY="40%"
        opacity={0.7}
        zIndex={0}
        className="w-[90vw] sm:w-[90vw] anim-riseUp xl:hidden"
        style={{ animation: "riseUpTurtleMobile 2800ms ease-out 0ms both" }}
      />
      {/* דסטופ (רק מ־xl = 1280px) */}
      <Turtle
        bottom="0%"
        translateY="37%"
        opacity={0.7}
        zIndex={0}
        className="w-[60vw] anim-riseUp hidden xl:block"
        style={{ animation: "riseUpTurtle 2800ms ease-out 0ms both" }}
      />

      {/* ===== TEXT + CTA (מקדימה!) ===== */}
      <div
        className="relative z-20 w-full text-center px-4 pt-[10vh] xl:pt-[16vh]"
        style={{ animation: "riseUp 2800ms ease-out 200ms both" }}
      >
        <h1
          className="
            mx-auto
            font-staatliches font-normal text-white
            text-[clamp(23px,3.2vw,34px)]
            leading-[clamp(27px,3.8vw,40px)]
            tracking-[0.015em]
            px-2 sm:px-4 xl:px-16
          "
        >

          CONNECT YOUR STORE TO{" "}
          <span className="text-green">3DFLY&apos;S</span> GLOBAL SUPPLIER
          NETWORK<span>! </span>
          <br className="xl:hidden" />
          YOU SELL, WE HANDLE THE REST.
          <br />
          <span className="text-green">NO</span> INVENTORY.{" "}
          <span className="text-green">NO</span> SHIPPING.{" "}
          <span className="text-green">NO</span> 3D PRINTER NEEDED.
        </h1>

        <div
          className="mt-8 md:mt-8 xl:hidden flex justify-center"
          style={{ animation: "riseUp 2800ms ease-out 400ms both" }}
        >
          <Button
            variant="primary"
            size="lg"
            hovering="darkBg"
            className="text-[clamp(16px,2.2vw,28px)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] px-10"
          >
            JOIN!
          </Button>
        </div>

      </div>
    </section>
  );
}
