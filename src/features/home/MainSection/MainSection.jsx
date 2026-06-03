import React from "react";
import Button from "../../../components/ui/Button";
import Turtle from "../../../components/ui/Turtle";
import MainSectionGlow from "./MainSectionGlow";
import GlobalSupplierScene from "./GlobalSupplierScene/GlobalSupplierScene";
import "./MainSection.css";

export default function MainSection() {
  return (
    <section className="relative w-full min-h-[calc(100svh-var(--nav-h))] overflow-hidden bg-dark">

      {/* ===== GLOW BACKGROUND ===== */}

      <MainSectionGlow />


      {/* ===== MOBILE / TABLET SCENE (Earth + Turtle + Lines + Pins) ===== */}
      <GlobalSupplierScene className="xl:hidden" />

      {/* ===== DESKTOP TURTLE (xl and above) ===== */}
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
        className="relative z-20 w-full text-center px-4 pt-[7vh] xl:pt-[16vh]"
        style={{ animation: "riseUp 2800ms ease-out 200ms both" }}
      >
        <h1
          className="
            mx-auto
            font-staatliches font-normal text-white
            text-[clamp(23px,3.2vw,34px)]
            leading-[clamp(27px,3.8vw,40px)]
            md:text-[clamp(27px,4.2vw,40px)]
            md:leading-[clamp(32px,4.9vw,46px)]
            tracking-[0.015em]
            px-4 sm:px-8 xl:px-16
          "
        >
          CONNECT YOUR STORE TO{" "}
          <span className="text-green">3DFLY&apos;S</span> GLOBAL{" "}
          {/* non-breaking space: NETWORK! never wraps alone on the previous line */}
          SUPPLIER{"\u00A0"}NETWORK!{" "}
          {/* ── gap after NETWORK! on mobile/tablet only ── */}
          <span className="block mt-5 xl:hidden" />
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